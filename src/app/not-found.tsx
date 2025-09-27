// src/app/not-found.tsx
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center text-white">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-gray-400">The page you are looking for does not exist.</p>
      <a
        href="/"
        className="mt-6 px-4 py-2 bg-[#F29145] text-black font-medium rounded-lg hover:bg-[#EE701D] transition"
      >
        Back to Home
      </a>
    </div>
  );
}
