import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "우리집 게시판", template: "%s · 우리집 게시판" },
  description: "우리 가족 공지와 전할 말",
  applicationName: "우리집 게시판",
  // iOS 홈 화면에 추가했을 때 주소창 없이 앱처럼 열린다
  appleWebApp: { capable: true, title: "우리집 게시판", statusBarStyle: "default" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // Figma `surface/page` (Light / Dark)
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F2F4F6" },
    { media: "(prefers-color-scheme: dark)", color: "#101014" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
