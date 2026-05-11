import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prode Mundial",
  description: "Predicciones del Mundial 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}