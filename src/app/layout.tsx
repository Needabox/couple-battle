import type { Metadata } from "next";
import { Fredoka, Quicksand } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Couple Battle! 💕 Monopoli Virtual Pasangan LDR",
  description: "Board game monopoli mini seru untuk pasangan LDR. Tersinkronisasi dua arah secara realtime via WebRTC PeerJS tanpa backend!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${fredoka.variable} ${quicksand.variable} h-full antialiased`}
    >
      <body className="min-h-full font-quicksand bg-[#FFFDF5] text-[#2D2A26] selection:bg-pink-200 selection:text-pink-900">
        {children}
      </body>
    </html>
  );
}

