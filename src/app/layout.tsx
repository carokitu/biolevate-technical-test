import type { Metadata } from "next";
import { Geist, Luckiest_Guy } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const pokemon = Luckiest_Guy({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pokemon",
});

export const metadata: Metadata = {
  title: "Pokedex",
  description: "Search Pokémon, moves, and abilities.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${pokemon.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
