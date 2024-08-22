import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export const useSuggestedFollowers = () => {
  const { postId } = useParams();

  const {
    data: suggestedFollowers,
    refetch,
    isRefetching: isRefetchingShare,
  } = useQuery({
    queryKey: ["suggestedFollowers"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/followers/${postId}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });
  return { suggestedFollowers, refetch, isRefetchingShare };
};
