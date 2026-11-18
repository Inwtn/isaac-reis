import { Portfolio } from "@/src/components/Portfolio";
import { pageMetadata } from "@/content/locales";
export const metadata = pageMetadata("pt", "home");
export default function Page() { return <Portfolio locale="pt" />; }
