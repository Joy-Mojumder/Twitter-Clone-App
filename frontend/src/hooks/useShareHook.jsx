import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

export const useSuggestedFollowers = () => {
  const postId = useSelector((state) => state.path.value);

  const {
    data: suggestedFollowers,
    isRefetching: isSFloading,
    refetch,
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
  return { suggestedFollowers, isSFloading, refetch, postId };
};
