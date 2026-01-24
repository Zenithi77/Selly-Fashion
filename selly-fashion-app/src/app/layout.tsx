import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingCart from "@/components/FloatingCart";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "SELLY | Premium Fashion",
  description: "Discover premium fashion from the finest brands. Quality meets contemporary design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth light" style={{ colorScheme: 'light' }}>
      <head>
        <meta name="color-scheme" content="light only" />
        <meta name="theme-color" content="#fff1f2" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-rose-50 text-slate-900 font-sans">
        <Header />
        {children}
        <Footer />
        <FloatingCart />
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1e293b',
              color: '#fff',
              borderRadius: '12px',
              padding: '12px 20px',
            },
            success: {
              iconTheme: {
                primary: '#ec4899',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
