'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="min-h-screen bg-[#0B0F17] text-white flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="text-2xl font-black text-rose-400">System Error</h2>
        <button
          onClick={() => reset()}
          className="bg-sky-600 hover:bg-sky-500 text-white font-black text-xs px-6 py-3 rounded-xl transition-colors"
        >
          RESET APPLICATION
        </button>
      </body>
    </html>
  );
}
