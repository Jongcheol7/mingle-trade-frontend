import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

type PortfolioFormData = {
  enterPrice: number;
  quantity: number;
  email: string;
  symbol: string;
  currency: string;
};

export function usePortfolioSelect(email: string, currency: string) {
  return useQuery({
    queryKey: ["portfolio", email, currency],
    queryFn: async () => {
      const res = await api.get("/api/portfolio/select", {
        params: { email, currency },
      });
      return res.data.data;
    },
    enabled: !!email,
    staleTime: 30 * 1000,
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
      const res = await api.post("/api/portfolio/delete", {
        email,
        id,
        currency,
      });
      return res.data;
    },
    onSuccess: (_data, { email, currency }) => {
      toast.success("포트폴리오가 삭제되었습니다.");
      queryClient.invalidateQueries({
        queryKey: ["portfolio", email, currency],
      });
    },
    onError: (err) => {
      toast.error(err.message || "포트폴리오 삭제에 실패했습니다.");
    },
  });
}

export function usePortfolioUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: PortfolioFormData) => {
      const res = await api.post("/api/portfolio/update", data);
      return res.data;
    },
    onSuccess: (_data, { email, currency }) => {
      toast.success("포트폴리오가 업데이트 되었습니다.");
      queryClient.invalidateQueries({
        queryKey: ["portfolio", email, currency],
      });
    },
    onError: (err) => {
      toast.error(err.message || "포트폴리오 업데이트에 실패했습니다.");
    },
  });
}

export function usePortfolioInsert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: PortfolioFormData) => {
      const res = await api.post("/api/portfolio/insert", data);
      return res.data;
    },
    onSuccess: (_data, { email, currency }) => {
      toast.success("포트폴리오가 추가되었습니다.");
      queryClient.invalidateQueries({
        queryKey: ["portfolio", email, currency],
      });
    },
    onError: (err) => {
      toast.error(err.message || "포트폴리오 추가에 실패했습니다.");
    },
  });
}
