import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUDUserIMG = () => {
  const queryClient = useQueryClient();

  const { mutate: editProfileImg, isPending: isPendingImg } = useMutation({
    mutationFn: async ({ coverImg, profileImg }) => {
      try {
        const res = await fetch(`/api/users/updateImg`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            coverImg,
            profileImg,
          }),
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
    onSuccess: () => {
      toast.success("Profile image updated successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { editProfileImg, isPendingImg };
};
