import type { Metadata } from 'next';
import { Inter, Space_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono'
});

export const metadata: Metadata = {
  title: 'OpenArena | The Trust Machine for AI',
  description: 'The First Decentralized Adversarial Evaluation Protocol on Bittensor.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceMono.variable} font-sans antialiased text-brand-dark min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
