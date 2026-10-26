import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "คำถามถึงยู 🐾",
  description: "9 คำถามน่ารัก ๆ ที่ทำมาให้ยูคนเดียว",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
