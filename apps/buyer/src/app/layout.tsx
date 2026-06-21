import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Providers from "@/components/Providers";
import ConditionalLayout from "@/components/ConditionalLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default:  "Veloria — Your Premium Marketplace",
    template: "%s — Veloria",
  },
  description:
    "Shop 1,400+ premium products across electronics, fashion, beauty, home & more. Free shipping on orders over $50.",
  keywords: ["online shopping", "marketplace", "fashion", "electronics", "beauty", "home decor"],
  openGraph: {
    type:        "website",
    siteName:    "Veloria",
    title:       "Veloria — Your Premium Marketplace",
    description: "Shop 1,400+ premium products. Free shipping over $50. Easy returns.",
    images: [{ url: "/featured.png", width: 1200, height: 630, alt: "Veloria" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Veloria — Your Premium Marketplace",
    description: "Shop 1,400+ premium products. Free shipping over $50.",
    images:      ["/featured.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Suspense>
            <ConditionalLayout>{children}</ConditionalLayout>
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
