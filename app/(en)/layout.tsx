import { Document, portfolioViewport } from "@/src/components/Document";
export const viewport = portfolioViewport;
export default function Layout({children}: {children: React.ReactNode}) {
  return <Document locale="en">{children}</Document>;
}
