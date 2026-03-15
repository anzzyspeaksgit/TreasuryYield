import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AnimatedGridPattern } from "@/components/AnimatedGridPattern";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TreasuryYield",
  description: "Tokenized US Treasury Bills on BNB Chain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AnimatedGridPattern />
          <div className="relative z-10">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
