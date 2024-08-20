import { useQuery } from "@tanstack/react-query";

export const useRTSuggestedUsers = () => {
  const { data: suggestedRtUsers, isLoading: isLoadingSuggested } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/suggested`);
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
  return { suggestedRtUsers, isLoadingSuggested };
};
