"use client";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFreeBoardAllLists } from "@/hooks/crypto/freeboard/useFreeBoardReactQuery";
import { useState } from "react";
import { FreeBoard } from "@/types/freeboard";
import { Loader2, PenLine } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import AvartarModule from "@/modules/common/AvartarModule";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserStore } from "@/store/useUserStore";
import ChatWindow from "@/modules/chat/ui/ChatWindow";

export default function FreeBoardLists() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useFreeBoardAllLists(page);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { email } = useUserStore();
  const [chatTarget, setChatTarget] = useState<FreeBoard | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center w-full items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data || !data.lists?.length) {
    return (
      <div className="flex w-full gap-4 flex-col justify-center items-center text-muted-foreground h-64">
        <p>게시글이 없습니다.</p>
        <Link href="/crypto/freeboard/write/0">
          <Button className="cursor-pointer gap-2">
            <PenLine className="w-4 h-4" />
            글쓰기
          </Button>
        </Link>
      </div>
    );
  }

  const lists = data.lists ?? [];
  const totalCount = data.total ?? 0;
  const totalPages = Math.ceil(totalCount / 10);

  const handlePageChange = (reqPage: number) => {
    if (reqPage < 1 || reqPage > totalPages) return;
    setPage(reqPage);
  };

  const startPage = Math.floor((page - 1) / 10) * 10 + 1;
  const endPage = Math.min(startPage + 9, totalPages);
  const pageNums = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  const handleViewContent = async (post: FreeBoard) => {
    const res = await api.post("/api/freeboard/viewUp", {
      boardId: post.id,
      email: post.email,
    });
    if (res.data === "success") {
      queryClient.invalidateQueries({ queryKey: ["freeboardLists", page] });
    }
    router.push(`/crypto/freeboard/${post.id}`);
  };

  return (
    <div className="w-full mx-auto">
      {/* 상단 헤더 */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-foreground">자유게시판</h2>
        <Link href="/crypto/freeboard/write/0">
          <Button size="sm" className="cursor-pointer gap-1.5">
            <PenLine className="w-3.5 h-3.5" />
            글쓰기
          </Button>
        </Link>
      </div>

      {/* 게시글 리스트 */}
      <Card className="border border-border p-0 overflow-hidden">
        <CardContent className="p-0">
          <div className="hidden sm:grid grid-cols-[60px_1fr_140px_60px] bg-muted text-sm font-medium text-muted-foreground text-center py-2.5 border-b border-border">
            <p>#</p>
            <p className="text-left pl-4">제목</p>
            <p className="text-left">작성자</p>
            <p>조회</p>
          </div>

          {lists.map((post: FreeBoard) => (
            <div
              key={post.id}
              className="grid grid-cols-[1fr_auto] sm:grid-cols-[60px_1fr_140px_60px] text-center py-3 px-3 sm:px-0 hover:bg-muted/30 transition border-b border-border last:border-none text-sm gap-y-1"
            >
              <p className="hidden sm:block text-muted-foreground">{post.id}</p>
              <p
                className="text-foreground hover:text-primary cursor-pointer text-left pl-4 truncate"
                onClick={() => handleViewContent(post)}
              >
                {post.title}
              </p>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="flex gap-1.5 items-center cursor-pointer">
                    <AvartarModule src={post.profile_image} />
                    <span className="text-sm text-muted-foreground truncate">
                      {post.nickname}
                    </span>
                  </div>
                </DropdownMenuTrigger>
                {email !== post.email ? (
                  <DropdownMenuContent>
                    <DropdownMenuItem>친구추가</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => setChatTarget(post)}
                    >
                      메세지
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                ) : (
                  <DropdownMenuContent>
                    <DropdownMenuItem>수정</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => {
                        const confirmDelete =
                          window.confirm("정말 삭제하시겠습니까?");
                        if (confirmDelete) {
                          //deleteMutate({ postId: post.id, onClose });
                        }
                      }}
                    >
                      삭제
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                )}
              </DropdownMenu>

              <p className="hidden sm:block text-muted-foreground">{post.views}</p>

              {chatTarget && (
                <ChatWindow
                  receiverNickname={chatTarget.nickname}
                  receiverUrl={chatTarget.profile_image}
                  receiverEmail={chatTarget.email}
                  onClose={() => setChatTarget(null)}
                />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 페이지네이션 */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <Button
          size="sm"
          className="cursor-pointer"
          variant="outline"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          이전
        </Button>

        {pageNums.map((num) => (
          <button
            key={num}
            onClick={() => handlePageChange(num)}
            className={`w-8 h-8 rounded-md text-sm cursor-pointer transition-colors ${
              page === num
                ? "bg-primary text-primary-foreground font-semibold"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {num}
          </button>
        ))}

        <Button
          size="sm"
          className="cursor-pointer"
          variant="outline"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
