'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col items-center justify-center p-6 text-center space-y-4">
      <h2 className="text-2xl font-black text-rose-400">Something went wrong!</h2>
      <p className="text-xs text-slate-400 max-w-md">
        {error.message || 'An unexpected error occurred while loading the citizen portal.'}
      </p>
      <button
        onClick={() => reset()}
        className="bg-sky-600 hover:bg-sky-500 text-white font-black text-xs px-6 py-3 rounded-xl transition-colors"
      >
        TRY AGAIN
      </button>
    </div>
  );
}
