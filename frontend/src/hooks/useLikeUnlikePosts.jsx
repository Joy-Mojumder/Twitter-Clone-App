import { useMutation } from "@tanstack/react-query";

export const useLikeUnlikePosts = () => {
  const { mutate: LikeUnlike, isPending: isPendingLike } = useMutation({
    mutationFn: async ({ postId, seen }) => {
      const res = await fetch(`/api/posts/like/${postId}`, {
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
      return;
    },
  });

  return { LikeUnlike, isPendingLike };
};
