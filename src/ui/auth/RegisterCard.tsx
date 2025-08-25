"use client";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import Button from "@/ui/Button";
import InputField from "@/ui/InputField";
import { Checkbox } from "@/ui/Checkbox";
import Dropdown from "@/ui/Dropdown";

type Form = {
  email: string;
  phone: string;
  password: string;
  confirm: string;
  country: string;
  agree: boolean;
};

export default function RegisterCard({
  standalone = false,
  onSubmit,
}: {
  standalone?: boolean;
  onSubmit?: (data: Form) => Promise<void> | void;
}) {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    getValues,
    watch,
    setError,
  } = useForm<Form>({
    mode: "onChange",
    defaultValues: {
      email: "",
      phone: "",
      password: "",
      confirm: "",
      country: "Poland",
      agree: false,
    },
  });

  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
  const router = useRouter();

  const agree = watch("agree");
  const canSubmit = isValid && agree;

  const submit = async (data: Form) => {
    try {
      const payload = {
        ...data,
        email: data.email.trim(),
        phone: data.phone.replace(/[^\d]/g, ""),
      };

      if (onSubmit) {
        await onSubmit(payload);
      } else {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          if (err?.field && err?.message) {
            setError(err.field as keyof Form, { type: "server", message: String(err.message) });
          } else if (err?.message) {
            setError("email", { type: "server", message: String(err.message) });
          } else {
            setError("email", { type: "server", message: "Unexpected error. Please try again." });
          }
          return;
        }
      }

      router.push("/auth/success");
    } catch {
      setError("email", { type: "server", message: "Network error. Please try again." });
    }
  };

  return (
    <div className={standalone ? "min-h-screen w-full bg-[#2B2F39] flex flex-col" : ""}>
      <main className={standalone ? "flex-1 flex items-center justify-center px-4" : ""}>
        <div className="flex flex-col items-center gap-8 w-[448px]">
          {/* Logo */}
          <div className="w-[199px] h-[50px] leading-[50px] font-['Inter'] font-semibold text-[40px] tracking-[-0.01em]">
            <span className="text-[#F29145]">Nexus</span><span className="text-white">Hub</span>
          </div>

          {/* Panel */}
          <form onSubmit={handleSubmit(submit)} className="w-[448px] bg-[#262626] border border-[#383B42] rounded-[6px] p-6" noValidate>
            {/* Title + divider */}
            <div className="flex flex-col gap-5 w-[400px]">
              <div className="text-white font-medium text-[24px] leading-[36px] -tracking-[0.01em]">Create Account</div>
              <div className="border-t border-[#383B42]" />
            </div>

            {/* Inputs */}
            <div className="mt-8 flex flex-col gap-8 w-[400px]">
              {/* Email */}
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Please enter a valid email address.",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Please enter a valid email address." },
                }}
                render={({ field }) => (
                  <InputField
                    size="xl"
                    className="w-[400px]"
                    label="Email"
                    placeholder="Your Email"
                    autoComplete="email"
                    value={field.value}
                    onChange={(e) => field.onChange(e.currentTarget.value)}
                    onBlur={field.onBlur}
                    destructive={!!errors.email}
                    error={errors.email?.message}
                  />
                )}
              />

              {/* Phone */}
              <Controller
                name="phone"
                control={control}
                rules={{
                  required: "Please enter your phone number.",
                  validate: (v) => v.replace(/[^\d]/g, "").length >= 10 || "Please enter your phone number.",
                }}
                render={({ field }) => (
                  <InputField
                    size="xl"
                    className="w-[400px]"
                    label="Mobile Number"
                    placeholder="+(Code country) 10 digit mobile number"
                    value={field.value}
                    onChange={(e) => field.onChange(e.currentTarget.value)}
                    onBlur={field.onBlur}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    destructive={!!errors.phone}
                    error={errors.phone?.message}
                  />
                )}
              />

              {/* Password */}
              <Controller
                name="password"
                control={control}
                rules={{
                  required: "Create a password which has at least 8 characters and includes at least 1 upper case letter, 1 lower case letter and 1 number.",
                  validate: (v) =>
                    (v.length >= 8 && /[A-Z]/.test(v) && /[a-z]/.test(v) && /[0-9]/.test(v)) ||
                    "Create a password which has at least 8 characters and includes at least 1 upper case letter, 1 lower case letter and 1 number.",
                }}
                render={({ field }) => (
                  <div className="relative w-[400px]">
                    <InputField
                      size="xl"
                      className="w-[400px]"
                      label="Password"
                      placeholder="Password"
                      autoComplete="new-password"
                      inputType={showPwd ? "text" : "password"}
                      value={field.value}
                      onChange={(e) => field.onChange(e.currentTarget.value)}
                      onBlur={field.onBlur}
                      onKeyUp={(e) => setCapsOn(e.getModifierState?.("CapsLock") ?? false)}
                      destructive={!!errors.password}
                      error={errors.password?.message}
                    />
                    <button
                      type="button"
                      aria-label="Toggle password visibility"
                      onClick={() => setShowPwd((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 grid place-items-center text-[#B0B0B0]"
                    >
                      {showPwd ? <EyeOpen /> : <EyeClosed />}
                    </button>

                    <PasswordHints password={field.value} capsOn={capsOn} />
                  </div>
                )}
              />

              {/* Confirm */}
              <Controller
                name="confirm"
                control={control}
                rules={{
                  required: "Please enter your confirm password.",
                  validate: (v) => v === getValues("password") || "Passwords do not match.",
                }}
                render={({ field }) => (
                  <div className="relative w-[400px]">
                    <InputField
                      size="xl"
                      className="w-[400px]"
                      label="Confirm Password"
                      placeholder="Confirm Password"
                      autoComplete="new-password"
                      inputType={showConfirm ? "text" : "password"}
                      value={field.value}
                      onChange={(e) => field.onChange(e.currentTarget.value)}
                      onBlur={field.onBlur}
                      destructive={!!errors.confirm}
                      error={errors.confirm?.message}
                    />
                    <button
                      type="button"
                      aria-label="Toggle confirm password visibility"
                      onClick={() => setShowConfirm((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 grid place-items-center text-[#B0B0B0]"
                    >
                      {showConfirm ? <EyeOpen /> : <EyeClosed />}
                    </button>

                    {watch("confirm") && watch("confirm") === watch("password") && !errors.confirm && (
                      <p className="mt-2 text-[12px] leading-[18px] text-[#22C55E]">Passwords match</p>
                    )}
                  </div>
                )}
              />

              {/* Country */}
              <Controller
                name="country"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <div className="w-[400px]">
                    <label className="block text-[18px] leading-[28px] font-medium text-[#FCFCFC] mb-4">
                      Country or region
                    </label>
                    <div className="relative w-[400px] h-[54px] rounded-[6px] border px-4" style={{ background: "#262626", borderColor: "#616674" }}>
                      <Dropdown
                        embedded
                        size="xl"
                        className="w-full"
                        options={[
                          "Indonesia","Poland","Germany","France","United Kingdom","United States",
                          "Greece","Italy","Spain","Netherlands","Belgium","Sweden","Norway","Denmark",
                          "Finland","Austria","Switzerland","Portugal","Czech Republic","Hungary","Ireland",
                        ]}
                        value={field.value}
                        onChange={(v) => field.onChange(v)}
                      />
                    </div>
                  </div>
                )}
              />

              {/* Terms + submit */}
              <div className="flex flex-col gap-6 w-[400px]">
                <Controller
                  name="agree"
                  control={control}
                  rules={{ validate: (v) => v || "Please accept the terms." }}
                  render={({ field }) => (
                    <div className="flex items-start gap-4">
                      <Checkbox size="l" checked={!!field.value} onChange={field.onChange} />
                      <p className="text-[14px] leading-[24px] text-[#E7E7E7]">
                        By creating an account and check, you agree to the{" "}
                        <a className="underline" href="#">Conditions of Use</a>{" "}
                        and <a className="underline" href="#">Privacy Notice</a>.
                        {errors.agree && <span className="ml-2 text-[#E05816]">{String(errors.agree.message)}</span>}
                      </p>
                    </div>
                  )}
                />

                <Button
                  size="xl"
                  className="w-[400px]"
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  aria-busy={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Account"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

/* ====== dodatki wizualne do hasła ====== */
function PasswordHints({ password, capsOn }: { password: string; capsOn: boolean }) {
  const rules = [
    { label: "8+ characters", ok: password.length >= 8 },
    { label: "1 uppercase",   ok: /[A-Z]/.test(password) },
    { label: "1 lowercase",   ok: /[a-z]/.test(password) },
    { label: "1 number",      ok: /[0-9]/.test(password) },
  ];
  const score = rules.filter(r => r.ok).length;
  const color = score <= 1 ? "#DC2626" : score <= 3 ? "#F29145" : "#22C55E";

  return (
    <div className="mt-2">
      <div className="h-1.5 rounded bg-[#383B42] overflow-hidden">
        <div className="h-full transition-all" style={{ width: `${(score/4)*100}%`, background: color }} />
      </div>
      <ul className="mt-2 grid grid-cols-2 gap-y-1">
        {rules.map(r => (
          <li key={r.label} className="flex items-center gap-2">
            <span className={`inline-block w-2.5 h-2.5 rounded-full ${r.ok ? "bg-[#22C55E]" : "bg-[#616674]"}`} />
            <span className={`text-[12px] leading-[18px] ${r.ok ? "text-neutral-300" : "text-neutral-500"}`}>{r.label}</span>
          </li>
        ))}
      </ul>
      {capsOn && <p className="mt-2 text-[12px] leading-[18px] text-[#E05816]">Caps Lock is on</p>}
    </div>
  );
}

/* proste ikonki */
function EyeOpen() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 5c5 0 8.5 3.5 10 7-1.5 3.5-5 7-10 7s-8.5-3.5-10-7c1.5-3.5 5-7 10-7Z" stroke="#B0B0B0" strokeWidth="1.5"/>
      <circle cx="12" cy="12" r="3" stroke="#B0B0B0" strokeWidth="1.5"/>
    </svg>
  );
}
function EyeClosed() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 3l18 18" stroke="#B0B0B0" strokeWidth="1.5"/>
      <path d="M12 5c5 0 8.5 3.5 10 7-.5 1.2-1.2 2.3-2 3.3M6 8.3C7.9 6.5 10 5 12 5c.8 0 1.6.1 2.4.3" stroke="#B0B0B0" strokeWidth="1.5"/>
    </svg>
  );
}
