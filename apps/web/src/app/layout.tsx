import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";

import "../index.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Providers from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cloud Vento | AI-Powered AWS Cost Optimization & Monitoring",
  description: "Monitor and optimize your AWS infrastructure costs with AI-powered insights, cost breakdowns, and smart recommendations for cloud savings.",
  icons: {
    icon: "/favicon.png",
  },
  verification: {
    google: "yzcLjbA4j20Ui8iMP82TY2pwoND0npG9LAK5DAKnoZA",
  },
  openGraph: {
    title: "Cloud Vento | AI-Powered AWS Cost Optimization & Monitoring",
    description: "Monitor and optimize your AWS infrastructure costs with AI-powered insights, cost breakdowns, and smart recommendations for cloud savings.",
    url: "https://cloudvento.vercel.app",
    siteName: "Cloud Vento",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cloud Vento | AI-Powered AWS Cost Optimization & Monitoring",
    description: "Monitor and optimize your AWS infrastructure costs with AI-powered insights, cost breakdowns, and smart recommendations.",
  },
  other: {
    "script:ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Cloud Vento",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description: "AI-powered AWS infrastructure cost monitoring and optimization platform with intelligent insights and recommendations.",
      url: "https://cloudvento.vercel.app",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    }),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <div className="flex flex-col min-h-svh">
            <Header />
            <main className="flex-1 pt-16">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
