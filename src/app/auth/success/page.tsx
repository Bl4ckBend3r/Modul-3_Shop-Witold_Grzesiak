export const metadata = { title: "Thanks for registering – NexusHub" };

export default function RegisterSuccessPage() {
  return (
    <main className="min-h-screen bg-[#1A1A1A] flex items-center justify-center px-6">
      <div className="text-center flex flex-col items-center gap-10 max-w-[600px]">
        {/* Ikona */}
<div className="relative w-[100px] h-[100px] flex items-center justify-center">
  {/* Okrąg z obrysem */}

  {/* Ikona check */}
  <svg width="100" height="100" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="#86EFAD" strokeWidth="1.5" />
    <path
      d="M8 12.5l2.5 2.5L16 9.5"
      stroke="#86EFAD"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
</div>


        {/* Teksty */}
        <div className="flex flex-col gap-4">
          <h1 className="text-[32px] leading-[40px] font-bold text-white">
            Thank you!
          </h1>
          <p className="text-[20px] leading-[30px] font-medium text-white">
            You have successfully registered
          </p>
        </div>

        {/* Opis */}
        <p className="text-[18px] leading-[28px] text-[#E7E7E7]">
          Please check your e-mail for further information. Let’s explore our
          products and enjoy many gifts.
        </p>

        {/* Link */}
        <div className="flex items-center gap-2 text-[16px] leading-[24px]">
          <span className="text-[#E7E7E7]">Having problem?</span>
          <a href="/contact" className="text-[#F7B87A] underline">
            Contact us
          </a>
        </div>
      </div>
    </main>
  );
}
