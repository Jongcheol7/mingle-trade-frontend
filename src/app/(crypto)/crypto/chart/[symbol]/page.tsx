import BinanceChart from "@/modules/crypto/chart/BinanceChart";

type Props = {
  params: Promise<{ symbol: string }>;
};

export default async function Page({ params }: Props) {
  const { symbol } = await params;
  return <BinanceChart symbol={symbol} />;
}
