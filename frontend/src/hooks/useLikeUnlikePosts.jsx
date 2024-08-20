import { useMutation } from "@tanstack/react-query";

export const useLikeUnlikePosts = () => {
  const { mutate: LikeUnlike, isPending: isPendingLike } = useMutation({
    mutationFn: async (postId) => {
      await fetch(`/api/posts/like/${postId}`, {
        method: "POST",
      });
    },
  });

  return { LikeUnlike, isPendingLike };
};
