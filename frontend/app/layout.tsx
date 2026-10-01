import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'LuminaPress — Modern Engineering, Next.js & Strapi CMS',
    template: '%s | LuminaPress',
  },
  description:
    'A premier digital publication exploring AI systems, headless Strapi CMS architecture, Next.js, and modern software design.',
  keywords: ['Next.js', 'Strapi CMS', 'TypeScript', 'Tailwind CSS', 'Artificial Intelligence', 'Web Architecture'],
  authors: [{ name: 'LuminaPress Editorial' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-screen flex flex-col bg-[#090a0f] text-zinc-100 selection:bg-indigo-500 selection:text-white">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
