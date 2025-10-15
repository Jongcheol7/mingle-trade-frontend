import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export default function useFreeBoardSave() {
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
