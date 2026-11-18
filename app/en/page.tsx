import { Portfolio } from "@/src/components/Portfolio";
import { pageMetadata } from "@/content/locales";
export const metadata = pageMetadata("en", "home");
export default function Page() { return <Portfolio locale="en" />; }
