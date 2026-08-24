import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'RepairBeforeReplace — Don\'t replace it. Diagnose it.',
  description: 'AI-powered visual hardware diagnostic workstation that helps you determine whether a broken physical object can be repaired before replacing it.',
  keywords: ['RepairBeforeReplace', 'AI Repair Assistant', 'Hardware Diagnosis', 'Sustainability', 'Right to Repair'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-charcoal-900 text-slate-100 flex flex-col justify-between antialiased">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
