import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TaxMitra.ai · Conversational AI Income Tax Filing for First-Timers',
  description: 'AI-driven Income Tax filing (ITR-1/ITR-2) for young professionals, gig workers, and first-time filers. Multimodal Form 16 PDF parsing, plain-language Q&A, and Old vs. New Regime simulator.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
