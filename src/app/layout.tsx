import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Use Inter for a clean, modern look
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' }); // Changed font to Inter

export const metadata: Metadata = {
  title: 'AuthGuard - 2FA System', // Updated title
  description: 'Web application for Two-Factor Authentication diploma project.', // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster /> {/* Add Toaster component */}
      </body>
    </html>
  );
}
