import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export function useFreeBoardSave() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await axios.post(
        "http://localhost:8080/api/freeboard/insert",
        data
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["freeboardLists"] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}

export function useFreeBoardAllLists(page = 1) {
  return useQuery({
    queryKey: ["freeboardLists", page],
    queryFn: async () => {
      const res = await axios.get(
        "http://localhost:8080/api/freeboard/selectAll",
        {
          params: {
            page: page,
            limit: 10,
          },
        }
      );
      return res.data;
    },
  });
}

export function useFreeBoardDetails(id: number, enabled: boolean) {
  return useQuery({
    queryKey: ["freeboardDetails", id],
    queryFn: async () => {
      console.log("받은 id : ", id);
      const res = await axios.get(`http://localhost:8080/api/freeboard/${id}`);
      console.log("결과 : ", res);
      return res.data;
    },
    enabled,
  });
}
