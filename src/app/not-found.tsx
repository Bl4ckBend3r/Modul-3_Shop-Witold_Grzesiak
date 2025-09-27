// src/app/not-found.tsx
export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#1A1A1A] text-white px-6">
      <h1 className="text-4xl font-bold text-[#F29145] mb-4">404</h1>
      <p className="text-lg text-gray-300 mb-6">
        Strona, której szukasz, nie istnieje.
      </p>
      <a
        href="/"
        className="px-4 py-2 rounded-md bg-[#F29145] text-black font-medium hover:bg-[#ee701d] transition-colors"
      >
        Wróć do strony głównej
      </a>
    </main>
  );
}
