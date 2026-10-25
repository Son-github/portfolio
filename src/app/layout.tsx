import type { Metadata, Viewport } from "next";
import "./globals.css";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: "손종인 | portfolio",
  description:
    "AWS 기반 인프라 설계부터 운영과 자동화까지. 엔지니어 손종인의 포트폴리오입니다.",
  openGraph: {
    title: "손종인 | portfolio",
    description: "안정적인 서비스 운영 환경을 고민하는 엔지니어.",
    locale: "ko_KR",
    type: "website",
    ...(siteUrl
      ? {
          url: siteUrl,
          images: [
            {
              url: "/og-image.svg",
              width: 1200,
              height: 630,
              alt: "손종인 포트폴리오",
            },
          ],
        }
      : {}),
  },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = {
  themeColor: "#080c10",
  width: "device-width",
  initialScale: 1,
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
