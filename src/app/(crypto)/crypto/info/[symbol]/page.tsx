import InfoMain from "@/modules/crypto/info/InfoMain";

type Props = {
  params: Promise<{ symbol: string }>;
};

export default async function Page({ params }: Props) {
  const { symbol } = await params;
  return <InfoMain symbol={symbol} />;
}
