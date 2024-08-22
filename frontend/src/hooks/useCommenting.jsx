import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCommenting = () => {
  const { mutate: comments, isPending: isCommentingPost } = useMutation({
    mutationFn: async ({ postId, text, seen }) => {
      const res = await fetch(`/api/posts/comment/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, seen }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      return data;
    },

    onSuccess: () => {
      toast.success("Comment added successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { comments, isCommentingPost };
};
