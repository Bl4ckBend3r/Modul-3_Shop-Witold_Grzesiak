// src/app/not-found.tsx
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#1A1A1A] text-white">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-lg mb-8">Strona nie została znaleziona</p>
      <a
        href="/"
        className="rounded-md bg-[#F29145] px-6 py-2 text-black font-medium hover:bg-[#ee701d]"
      >
        Wróć na stronę główną
      </a>
    </main>
  );
}
