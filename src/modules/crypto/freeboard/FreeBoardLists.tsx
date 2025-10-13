import Link from "next/link";

export default function FreeBoardLists() {
  return (
    <div>
      <h1>테스트</h1>
      <Link href={"/crypto/freeboard/write"}>글쓰기</Link>
    </div>
  );
}
