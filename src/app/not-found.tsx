import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-black text-sky-400 mb-2">404</h1>
      <h2 className="text-xl font-bold mb-4">Page Not Found</h2>
      <Link
        href="/"
        className="bg-sky-600 hover:bg-sky-500 text-white font-black text-xs px-6 py-3 rounded-xl transition-colors"
      >
        RETURN TO HOME
      </Link>
    </div>
  );
}
