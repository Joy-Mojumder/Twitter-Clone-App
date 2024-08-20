import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  const { mutate: deletePost, isPending } = useMutation({
    mutationFn: async (postId) => {
      try {
        const res = await fetch(`/api/posts/${postId}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: (data) => {
      toast.success(data.message);
      //^ refetch posts
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { deletePost, isPending };
};
