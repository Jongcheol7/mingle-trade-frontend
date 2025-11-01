import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export function usePortfolioSelect(email: string) {
  return useQuery({
    queryKey: ["portfolio", email],
    queryFn: async ({ queryKey }) => {
      const [, email] = queryKey;
      const res = await axios.get(
        "http://localhost:8080/api/portfolio/select",
        {
          params: { email },
        }
      );

      if (res.data.status === "success") {
        return res.data.data;
      } else {
        throw new Error(res.data.message || "조회 실패");
      }
    },
    enabled: !!email,
  });
}

export function usePortfolioDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ email, id }: { email: string; id: number }) => {
      const res = await axios.post(
        "http://localhost:8080/api/portfolio/delete",
        {
          email: email,
          id: id,
        }
      );
      return res.data;
    },
    onSuccess: (data, { email }) => {
      if (data.status === "success") {
        toast.success("포트폴리오가 삭제되었습니다.");
        queryClient.invalidateQueries({ queryKey: ["portfolio", email] });
      } else {
        toast.error("포트폴리오 삭제에 실패했습니다.");
      }
    },
    onError: () => {
      toast.error("서버 통신 에러.");
    },
  });
}
