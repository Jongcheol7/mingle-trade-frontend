import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

type FormData = {
  enterPrice: number;
  quantity: number;
  email: string;
  symbol: string;
  currency: string;
};

export function usePortfolioSelect(email: string, currency: string) {
  return useQuery({
    queryKey: ["portfolio", email, currency],
    queryFn: async ({ queryKey }) => {
      const [, email] = queryKey;
      const res = await axios.get(
        "http://localhost:8080/api/portfolio/select",
        {
          params: { email, currency },
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
    mutationFn: async ({
      email,
      id,
      currency,
    }: {
      email: string;
      id: number;
      currency: string;
    }) => {
      const res = await axios.post(
        "http://localhost:8080/api/portfolio/delete",
        {
          email: email,
          id: id,
          currency: currency,
        }
      );
      return res.data;
    },
    onSuccess: (data, { email, currency }) => {
      if (data.status === "success") {
        toast.success("포트폴리오가 삭제되었습니다.");
        queryClient.invalidateQueries({
          queryKey: ["portfolio", email, currency],
        });
      } else {
        throw new Error(data.message || "포트폴리오 삭제에 실패했습니다.");
      }
    },
    onError: () => {
      toast.error("서버 통신 에러.");
    },
  });
}

export function usePortfolioUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      enterPrice,
      quantity,
      email,
      symbol,
      currency,
    }: FormData) => {
      const res = await axios.post(
        "http://localhost:8080/api/portfolio/update",
        {
          enterPrice,
          quantity,
          email,
          symbol,
          currency,
        }
      );
      return res.data;
    },
    onSuccess: (data, { email, currency }) => {
      if (data.status === "success") {
        toast.success("포트폴리오가 업데이트 되었습니다.");
        queryClient.invalidateQueries({
          queryKey: ["portfolio", email, currency],
        });
      } else {
        throw new Error(data.message || "포트폴리오 업데이트에 실패했습니다.");
      }
    },
    onError: () => {
      toast.error("서버 통신 에러.");
    },
  });
}

export function usePortfolioInsert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      enterPrice,
      quantity,
      email,
      symbol,
      currency,
    }: FormData) => {
      const res = await axios.post(
        "http://localhost:8080/api/portfolio/insert",
        {
          enterPrice,
          quantity,
          email,
          symbol,
          currency,
        }
      );
      return res.data;
    },
    onSuccess: (data, { email, currency }) => {
      if (data.status === "success") {
        toast.success("포트폴리오가 업데이트 되었습니다.");
        queryClient.invalidateQueries({
          queryKey: ["portfolio", email, currency],
        });
      } else {
        throw new Error(data.message || "포트폴리오 업데이트에 실패했습니다.");
      }
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message =
        error.response?.data.message || "서버 오류가 발생했습니다.";
      toast.error(message);
    },
  });
}
