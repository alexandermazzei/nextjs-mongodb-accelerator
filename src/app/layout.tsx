import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// Load Inter font with optimized subset for better performance
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Metadata for SEO and browser
export const metadata: Metadata = {
  title: 'Next.js MongoDB Accelerator',
  description: 'High-performance, production-ready Next.js application with MongoDB optimization for Docker environments',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}