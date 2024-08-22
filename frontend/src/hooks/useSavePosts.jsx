import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useSavePosts = () => {
  const { mutate: savePost, isPending: isPendingSave } = useMutation({
    mutationFn: async ({ postId, seen }) => {
      try {
        const res = await fetch(`/api/posts/save/${postId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ seen }),
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
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return { savePost, isPendingSave };
};
