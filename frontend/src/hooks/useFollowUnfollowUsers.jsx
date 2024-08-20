import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useFollowUnfollowUsers = () => {
  const queryClient = useQueryClient();
  const { mutate: followUnfollowUser, isPending: isPendingFollowUnfollow } =
    useMutation({
      mutationFn: async (userId) => {
        try {
          const res = await fetch(`/api/users/follow/${userId}`, {
            method: "POST",
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
        toast.success(data?.message);
        //^ refetch users
        Promise.all([
          queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
          queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        ]);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  return { followUnfollowUser, isPendingFollowUnfollow };
};
