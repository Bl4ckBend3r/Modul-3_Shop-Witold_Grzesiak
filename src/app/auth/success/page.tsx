export const metadata = { title: "Thanks for registering – NexusHub" };

export default function RegisterSuccessPage() {
  return (
    <main className="min-h-screen bg-[#2B2F39] text-white flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        <div className="mx-auto mb-6 w-16 h-16 rounded-full flex items-center justify-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="#22C55E" strokeWidth="1.5" />
            <path d="M8 12.5l2.5 2.5L16 9.5" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h1 className="text-2xl font-semibold mb-1">Thank you!</h1>
        <p className="text-[#E7E7E7] mb-6">You have successfully registered.</p>

        <p className="text-[#B6BAC3] mb-8">
          Please check your e-mail for further information. Let’s explore our products and enjoy many gifts.
        </p>

        <div className="flex items-center justify-center gap-6 text-sm">
          <a href="/products" className="underline">Go to products</a>
          <span className="opacity-50">|</span>
          <span>Having problems? <a href="/contact" className="underline">Contact us</a></span>
        </div>
      </div>
    </main>
  );
}
