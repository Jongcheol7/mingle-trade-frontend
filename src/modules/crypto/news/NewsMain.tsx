"use client";
import { useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import NewsCard from "./NewsCard";
import { useCryptoNewsAllLists } from "@/hooks/crypto/news/useFreeBoardReactQuery";

export default function NewsMain() {
  const observerRef = useRef(null);
  const {
    data,
    isError,
    error,
    refetch,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useCryptoNewsAllLists();
  const queryClient = useQueryClient();

  const pinnedData = useMemo(() => {
    if (!data?.pages?.length) return [];
    const firstPinned = data.pages[0]?.pinned;
    return firstPinned ? firstPinned : null;
  }, [data]);

  const allNews = useMemo(() => {
    return data?.pages.flatMap((page) => page.result) ?? [];
  }, [data]);

  useEffect(() => {
    queryClient.removeQueries({ queryKey: ["blogLists"] });
    refetch();
  }, [queryClient, refetch]);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root: null, rootMargin: "200px", threshold: 0 }
    );
    const target = observerRef.current;
    if (target) observer.observe(target);
    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  if (isError) {
    const message = error?.message;
    toast.error(`에러 발생 : ${message}`);
  }

  // 로딩중 스피너 효과
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // 데이터가 없을 때 (검색 결과 없음 등)
  if (!allNews?.length && !pinnedData) {
    return (
      <div className="flex justify-center items-center h-64 text-muted-foreground">
        게시글이 없습니다.
      </div>
    );
  }

  return (
    <div className="pt-3">
      <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-2 py-10">
        {allNews &&
          allNews.map((news: NewsForm) => (
            <NewsCard key={news.id} news={news} />
          ))}
      </div>
      <div ref={observerRef} />
      {isFetchingNextPage && <p>글 불러오는 중...</p>}
    </div>
  );
}
