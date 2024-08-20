import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUDUserDetails = () => {
  const queryClient = useQueryClient();

  const { mutate: editProfileDetails, isPending: isPendingDetails } =
    useMutation({
      mutationFn: async ({
        fullName,
        username,
        email,
        bio,
        link,
        newPassword,
        currentPassword,
      }) => {
        try {
          const res = await fetch("/api/users/update", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fullName,
              username,
              email,
              bio,
              link,
              newPassword,
              currentPassword,
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
        toast.success("Profile details updated successfully");
        queryClient.invalidateQueries({ queryKey: ["profile"] });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  return { editProfileDetails, isPendingDetails };
};
