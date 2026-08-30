import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/components/AuthContext';

export const metadata: Metadata = {
  title: 'Patternify.io — The #1 AI Analyzer To Beat Prediction Markets & Trading Charts',
  description: 'Patternify is your all in one platform for making money on prediction markets and trading charts with the power of AI Vision.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-900 min-h-screen flex flex-col antialiased selection:bg-blue-600 selection:text-white">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          
          <footer className="border-t border-slate-200 bg-slate-950 text-slate-400 py-12 text-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs">
                  P
                </div>
                <span className="font-bold text-white text-sm">Patternify<span className="text-blue-400 font-mono">.io</span></span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-400">Powered by Neural AI Vision & Supabase</span>
              </div>

              <p className="text-slate-400 text-center sm:text-right text-[11px]">
                *Disclaimer: Informational analysis and decision support only, not financial advice. We never touch your wallet.
              </p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
