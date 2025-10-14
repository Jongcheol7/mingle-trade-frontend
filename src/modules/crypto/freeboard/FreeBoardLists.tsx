"use client";
import Link from "next/link";
import { useState } from "react";
import { dummy } from "./Dummy";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 10; // 한 페이지당 게시글 수

export default function FreeBoardLists() {
  const [page, setPage] = useState(1);

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const currentPosts = dummy.slice(start, end);
  const totalPages = Math.ceil(dummy.length / ITEMS_PER_PAGE);

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

          {currentPosts.map((post) => (
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
          variant="outline"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          이전
        </Button>

        <p className="text-sm text-gray-600">
          {page} / {totalPages}
        </p>

        <Button
          variant="outline"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          다음
        </Button>
        {/* 글쓰기 버튼 (오른쪽 정렬) */}
        <div className="flex justify-end">
          <Link href="/crypto/freeboard/write">
            <Button>글쓰기</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
