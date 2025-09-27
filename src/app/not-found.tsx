// app/not-found.tsx
export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#1A1A1A] text-white">
      <h1 className="text-3xl font-bold mb-4">404 - Strona nie została znaleziona</h1>
      <p className="mb-6 text-neutral-400">
        Przepraszamy, nie mogliśmy znaleźć strony, której szukasz.
      </p>
      <a
        href="/"
        className="px-6 py-3 bg-[#F29145] text-white rounded-lg hover:bg-[#ee701d] transition"
      >
        Wróć na stronę główną
      </a>
    </main>
  );
}
