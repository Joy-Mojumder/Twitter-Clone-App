import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { motion } from "framer-motion";

const Posts = ({ feedType, username, userId }) => {
  //^ get posts endpoint based on feedType
  const getPostsEndpoint = () => {
    switch (feedType) {
      case "for you":
        return "/api/posts/all";
      case "following":
        return "/api/posts/following";
      case "posts":
        return `/api/posts/user/${username}`;
      case "likes":
        return `/api/posts/liked/${userId}`;
      case "saved":
        return `/api/posts/saved/${userId}`;
      case "shared":
        return `/api/posts/shared/${userId}`;
      default:
        return "/api/posts/all";
    }
  };
  const POST_ENDPOINT = getPostsEndpoint();

  //^ get posts data
  const {
    data: POSTS,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const res = await fetch(POST_ENDPOINT);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false,
  });
  //^ refetch posts on feedType change
  useEffect(() => {
    refetch();
  }, [feedType, refetch, username]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && !isRefetching && POSTS?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && !isRefetching && POSTS && (
        <div>
          {POSTS.map((post) => (
            <Post key={post._id} post={post} feedType={feedType} />
          ))}
        </div>
      )}
    </motion.div>
  );
};
export default Posts;
