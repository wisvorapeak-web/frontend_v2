import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import TawkTo from "@/components/shared/TawkTo";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ascendix Summit: Food, AgriTech & Animal Science (ASFAA-2026)",
  description: "A premier global platform uniting leaders, innovators, researchers, policymakers, and investors across the food, agriculture, and animal science ecosystems in Amsterdam, Netherlands.",
  keywords: ["ASFAA-2026", "Ascendix Summit", "Food Tech", "AgriTech", "Animal Science", "Precision Agriculture", "Alternative Proteins", "Smart Farming", "Amsterdam Event"],
  authors: [{ name: "AnandVerse Web Services", url: "https://anandverse.space" }],
  creator: "AnandVerse Web Services",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ascendix.com",
    title: "Ascendix Summit: Food, AgriTech & Animal Science",
    description: "Uniting global leaders across food, agriculture, and animal science ecosystems in Amsterdam, Netherlands.",
    siteName: "ASFAA-2026",
  },
  twitter: {
    card: "summary_large_image",
    title: "ASFAA-2026: Food, AgriTech & Animal Science",
    description: "Join global innovators shaping sustainable food systems and agri-innovation in Amsterdam, Netherlands. April 13-15, 2027.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sora.variable} dark antialiased`}
    >
      <body className="min-h-screen bg-background text-foreground font-sans flex flex-col">
        {children}
        <TawkTo />
      </body>
    </html>
  );
}
