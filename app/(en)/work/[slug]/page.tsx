import { DetailPage, detailMetadata, detailParams } from "@/src/components/DetailPage";
type Props = {params: Promise<{slug: string}>};
export const generateStaticParams = () => detailParams("en");
export async function generateMetadata({params}: Props) { return detailMetadata("en", (await params).slug); }
export default async function Page({params}: Props) { return <DetailPage locale="en" slug={(await params).slug} />; }
