import FreeBoardDetails from "@/modules/crypto/freeboard/FreeBoardDetails";

type Props = {
  params: Promise<{ id: number }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <FreeBoardDetails id={id} />;
}
