// src/app/not-found.tsx
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-8">
      <h1 className="text-4xl font-bold mb-4 text-white">404 – Page Not Found</h1>
      <p className="text-neutral-400">Sorry, the page you are looking for does not exist.</p>
    </div>
  );
}
