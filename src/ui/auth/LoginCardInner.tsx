"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/ui/Button";
import InputField from "@/ui/InputField";
import { Checkbox } from "@/ui/Checkbox";
import Modal from "@/ui/Modal";

type Form = {
  identifier: string; // email lub telefon
  password: string;
  remember: boolean;
};

export default function LoginCardInner({
  onSubmitEmailPhone,
  standalone = false,
}: {
  onSubmitEmailPhone?: (id: string) => Promise<void> | void;
  standalone?: boolean;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [show, setShow] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("Invalid credentials.");

  const router = useRouter();
  const sp = useSearchParams();
  const callbackUrl = sp.get("from") || "/";

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    setError,
    getValues,
    watch,
  } = useForm<Form>({
    mode: "onChange",
    defaultValues: { identifier: "", password: "", remember: true },
  });

  const idRules = {
    required: "Please enter your email or mobile number.",
    validate: (v: string) => {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
      const phoneOk = v.replace(/[^\d]/g, "").length >= 10;
      return emailOk || phoneOk || "Please enter a valid email or phone.";
    },
  };

  const onSubmitStep1 = async ({ identifier }: Form) => {
    await onSubmitEmailPhone?.(identifier.trim());
    setStep(2);
  };

  const onSubmitStep2 = async ({ password }: Form) => {
    const identifier = getValues("identifier").trim();
    if (!identifier || !password) return;

    const res = await signIn("credentials", {
      redirect: false,
      identifier,
      password,
      callbackUrl,
    });

    if (!res || res.error) {
      const msg = res?.error || "Invalid email/phone or password.";
      setError("password", { type: "manual", message: msg });
      setErrorMsg(msg);
      setErrorOpen(true);
      return;
    }

    const url = new URL(res.url || callbackUrl, window.location.origin);
    url.searchParams.set("login", "success");
    router.replace(url.pathname + "?" + url.searchParams.toString());
  };

  return (
    <div className={standalone ? "min-h-screen w-full flex flex-col" : ""}>
      <main
        className={standalone ? "flex-1 flex items-center justify-center px-4" : ""}
      >
        <div className="flex flex-col items-center gap-8 w-[448px]">
          <div className="w-[199px] font-['Inter'] font-semibold text-[40px] leading-[50px] tracking-[-0.01em]">
            <span className="text-[#F29145]">Nexus</span>
            <span className="text-white">Hub</span>
          </div>

          <div
            id="loginPadd"
            className="relative w-[448px] bg-[#262626] border border-[#383B42] rounded-[6px] p-6 flex flex-col gap-[32px]"
          >
            <div className="flex flex-col gap-[20px] w-[400px]">
              <div className="text-[#FCFCFC] font-medium text-[24px] leading-[36px]">
                Sign in
              </div>
              <div className="border-t border-[#383B42] w-[400px]" />
            </div>

            {/* STEP 1 */}
            {step === 1 && (
              <form
                onSubmit={handleSubmit(onSubmitStep1)}
                className="flex flex-col gap-[32px] w-[400px]"
              >
                <div className="flex flex-col gap-4">
                  <label className="text-[#FCFCFC] text-[18px] leading-[28px] font-medium">
                    Email or mobile phone number
                  </label>

                  <Controller
                    name="identifier"
                    control={control}
                    rules={idRules}
                    render={({ field }) => (
                      <InputField
                        size="xl"
                        placeholder="Email or Mobile phone Number"
                        value={field.value}
                        onChange={(e) => field.onChange(e.currentTarget.value)}
                        onBlur={field.onBlur}
                        destructive={!!errors.identifier}
                        error={errors.identifier?.message}
                        className="w-[400px]"
                      />
                    )}
                  />
                </div>

                <Button
                  size="xl"
                  className="w-[400px] bg-[#F29145] text-[#262626] hover:bg-[#EE701D]"
                  type="submit"
                  disabled={!isValid || isSubmitting}
                >
                  Continue
                </Button>

                <p className="text-[#E7E7E7] text-[16px] leading-[26px]">
                  Don’t have an account?{" "}
                  <Link href="/auth/register" className="underline text-white">
                    Register
                  </Link>
                </p>
              </form>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <form
                onSubmit={handleSubmit(onSubmitStep2)}
                className="flex flex-col gap-[32px] w-[400px]"
              >
                <div className="flex flex-col gap-4">
                  <label className="text-[#FCFCFC] text-[18px] leading-[28px] font-medium">
                    Password
                  </label>

                  <div className="relative w-full">
                    <Controller
                      name="password"
                      control={control}
                      rules={{ required: "Please enter your password." }}
                      render={({ field }) => (
                        <InputField
                          size="xl"
                          type="stroke"
                          placeholder="Password"
                          inputType={show ? "text" : "password"}
                          value={field.value}
                          onChange={(e) => field.onChange(e.currentTarget.value)}
                          onBlur={field.onBlur}
                          destructive={!!errors.password}
                          error={errors.password?.message}
                          className="w-[400px]"
                        />
                      )}
                    />
                    <button
                      type="button"
                      aria-label="Toggle password visibility"
                      onClick={() => setShow((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 grid place-items-center text-[#B0B0B0]"
                    >
                      <EyeIcon open={show} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full">
                  <Controller
                    name="remember"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center gap-3">
                        <Checkbox
                          size="l"
                          checked={!!field.value}
                          onChange={field.onChange}
                        />
                        <span className="text-[16px] leading-[26px] text-[#E7E7E7]">
                          Save password
                        </span>
                      </div>
                    )}
                  />
                  <Link
                    href="/auth/forgot"
                    className="text-white text-[16px] leading-[26px] font-medium"
                  >
                    Forgot your password?
                  </Link>
                </div>

                <Button
                  size="xl"
                  className="w-[400px] bg-[#F29145] text-[#262626] hover:bg-[#EE701D]"
                  type="submit"
                  disabled={isSubmitting || !watch("password")}
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </Button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm text-[#B0B0B0] underline"
                >
                  Use a different email/phone
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Modal open={errorOpen} onClose={() => setErrorOpen(false)}>
        <div
          className="flex items-start gap-4 rounded-[6px] p-5 border"
          style={{ background: "#FEF2F2", borderColor: "#F87171" }}
        >
          <div className="shrink-0 w-[30px] h-[30px] grid place-items-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="12" cy="12" r="10" stroke="#DC2626" strokeWidth="2" />
              <path
                d="M12 7v7M12 16v1"
                stroke="#DC2626"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="flex-1">
            <div className="mb-2">
              <div className="text-[20px] leading-[30px] font-medium text-[#262626]">
                Sign in failed
              </div>
              <div className="text-[16px] leading-[26px] text-[#5D5D5D]">
                {errorMsg}
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setErrorOpen(false)}
                className="h-[44px] px-5 rounded-[6px] border text-[14px] leading-[24px]"
                style={{ borderColor: "#DC2626", color: "#DC2626" }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => setShow(false)}
                className="h-[44px] px-5 rounded-[6px] text-white"
                style={{ background: "#DC2626" }}
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 5c5 0 8.5 3.5 10 7-1.5 3.5-5 7-10 7s-8.5-3.5-10-7c1.5-3.5 5-7 10-7Z"
        stroke="#B0B0B0"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="3" stroke="#B0B0B0" strokeWidth="1.5" />
    </svg>
  ) : (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 3l18 18" stroke="#B0B0B0" strokeWidth="1.5" />
      <path
        d="M12 5c5 0 8.5 3.5 10 7-.5 1.2-1.2 2.3-2 3.3M6 8.3C7.9 6.5 10 5 12 5c.8 0 1.6.1 2.4.3"
        stroke="#B0B0B0"
        strokeWidth="1.5"
      />
    </svg>
  );
}
