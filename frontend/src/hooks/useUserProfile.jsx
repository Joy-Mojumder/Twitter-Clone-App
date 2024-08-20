import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export const useUserProfile = () => {
  const { username } = useParams();

  const {
    data: user,
    refetch,
    isRefetching,
    isLoading,
  } = useQuery({
    queryKey: ["profile"],

    //^ get auth user from data query
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        if (data.error) return null;
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  return { user, refetch, isRefetching, isLoading };
};
