// src/app/not-found.tsx
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#1A1A1A] text-white">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-4 text-lg">Nie znaleziono strony.</p>
      <a
        href="/"
        className="mt-6 rounded-lg bg-[#F29145] px-4 py-2 text-black font-medium hover:bg-[#ee701d]"
      >
        Wróć na stronę główną
      </a>
    </main>
  );
}
