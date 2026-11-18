import { DetailPage, detailMetadata, detailParams } from "@/src/components/DetailPage";
type Props = {params: Promise<{slug: string}>};
export const generateStaticParams = () => detailParams("pt");
export async function generateMetadata({params}: Props) { return detailMetadata("pt", (await params).slug); }
export default async function Page({params}: Props) { return <DetailPage locale="pt" slug={(await params).slug} />; }
