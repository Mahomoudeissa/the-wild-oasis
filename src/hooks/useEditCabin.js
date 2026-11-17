import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCabin } from "../services/apiCabins";
import { toast } from "react-hot-toast";

export function useEditCabin() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: updateCabin,

    onSuccess: () => {
      toast.success("Cabin successfully updated");

      queryClient.invalidateQueries({
        queryKey: ["cabin"],
      });
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { mutate, isPending };
}
