import FreeBoardForm from "@/modules/crypto/freeboard/FreeBoardForm";

type Props = {
  params: Promise<{ id: number }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <FreeBoardForm id={id} />;
}
