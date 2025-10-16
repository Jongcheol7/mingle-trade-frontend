"use client";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFreeBoardAllLists } from "@/hooks/crypto/freeboard/useFreeBoardReactQuery";
import { useState } from "react";
import { FreeBoard } from "@/types/freeboard";

export default function FreeBoardLists() {
  const [page, setPage] = useState(1);
  const { data } = useFreeBoardAllLists(page);

  const lists = data?.lists ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / 10);

  const handlePageChange = (reqPage: number) => {
    if (reqPage < 1 || reqPage > totalPages) return;
    setPage(reqPage);
  };

  console.log("받은 데이터 : ", data);

  return (
    <div className="w-full mx-auto">
      {/* 게시글 리스트 */}
      <Card className="border border-gray-200 p-0">
        <CardContent className="p-0">
          <div className="grid grid-cols-[70px_4fr_150px_70px] bg-gray-100 font-semibold text-center py-3 border-b">
            <p>번호</p>
            <p>제목</p>
            <p>작성자</p>
            <p>조회수</p>
          </div>

          {lists.map((post: FreeBoard) => (
            <div
              key={post.id}
              className="grid grid-cols-[70px_4fr_150px_70px] text-center py-3 hover:bg-gray-50 transition border-b last:border-none"
            >
              <p className="text-gray-500">{post.id}</p>
              <p className="text-blue-600 hover:underline cursor-pointer text-left pl-4">
                {post.title}
              </p>
              <p>{post.writer}</p>
              <p>{post.views}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 페이지네이션 */}
      <div className="flex justify-center items-center gap-3 mt-6">
        <Button
          className="cursor-pointer"
          variant="outline"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          이전
        </Button>

        <p className="text-sm text-gray-600">
          {page} / {totalPages}
        </p>

        <Button
          className="cursor-pointer"
          variant="outline"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          다음
        </Button>
        {/* 글쓰기 버튼 (오른쪽 정렬) */}
        <div className="flex justify-end">
          <Link href="/crypto/freeboard/write">
            <Button className="cursor-pointer">글쓰기</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
