"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { timeTransform } from "@/modules/common/TimeTransform";
import DOMPurify from "dompurify";
import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { useBlogViewsMutation } from "@/hooks/useBlogViews";

type Props = {
  news: NewsForm;
};

export default function NewsCard({ news }: Props) {
  //const router = useRouter();
  //const { mutateAsync: viewMutate } = useBlogViewsMutation();

  return (
    <Card
      className="cursor-pointer"
      // onClick={async () => {
      //   await viewMutate(blog.id);
      //   router.push(`details/${blog.id}`);
      // }}
    >
      <CardContent className="group relative">
        <div className="flex relative w-full h-[300px] group-hover:blur-xs">
          <Image
            className="object-cover"
            src={news.imageUrl}
            alt={news.title}
            fill
            priority
            loader={({ src }) => src}
          />
        </div>
        <div className="flex flex-col gap-1 p-3 absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/50 text-slate-200 transition-all">
          <div
            className="max-w-none overflow-hidden relative"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(news.content),
            }}
          />
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex items-center w-full justify-between">
          <p className="text-foreground font-bold text-[17px] line-clamp-1 flex-1">
            {news.title}
          </p>
          <p className="text-muted-foreground text-[13px] w-[70px]">
            {" "}
            {timeTransform(news.createdAt).date}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
