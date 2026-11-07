import type { Metadata, Viewport } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Wonder Nature · 花园星球",
  description: "探索地球上的奇妙生命。在原创三维花园星球上，转动、放大并观察四处模拟自然生境。",
};
export const viewport: Viewport = { themeColor: "#0b100f" };
export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="zh-CN"><body>{children}</body></html>;
}
