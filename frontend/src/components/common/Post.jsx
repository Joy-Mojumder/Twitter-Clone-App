import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { FaChartSimple } from "react-icons/fa6";

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLikeUnlikePosts } from "../../hooks/useLikeUnlikePosts";
import { useCommenting } from "../../hooks/useCommenting";
import { useDeletePost } from "../../hooks/useDeletePost";
import { formatDate } from "../../utils/date";
import { useSavePosts } from "../../hooks/useSavePosts";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import { useSuggestedFollowers } from "../../hooks/useShareHook";
import toast from "react-hot-toast";

const Post = ({ post, feedType }) => {
  // ^ set comment
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState([...post.comments]);
  const { comments } = useCommenting();
  const [isCommenting, setIsCommenting] = useState(false);

  //^ get auth user from data query
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  //^ set post seen or not
  const [postSeen, setPostSeen] = useState({
    seen: post.seen?.includes(authUser?._id),
    seenCount: post.seen.length,
  });

  const { deletePost, isPending } = useDeletePost();

  //^ use like unlike posts
  const { LikeUnlike, isPendingLike } = useLikeUnlikePosts();

  const [isLiked, setIsLiked] = useState({
    liked: post.likes?.includes(authUser?._id),
    likesCount: post.likes.length,
  });

  const { savePost, isPendingSave } = useSavePosts();

  const [isSaved, setIsSaved] = useState({
    saved: post.saves?.includes(authUser?._id),
  });

  const { suggestedFollowers, refetch, isRefetchingShare } =
    useSuggestedFollowers();

  const { postId } = useParams();

  useEffect(() => {
    refetch();
  }, [postId, refetch]);

  const { mutate: sharePost, isPending: isPendingShare } = useMutation({
    mutationFn: async ({ postId, receiverId, seen }) => {
      try {
        const res = await fetch(`/api/posts/share/${postId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ receiverId, seen }),
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
      toast.success(data.message);

      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  //^ check is share or not
  const sender = post.shares.map((share) => {
    if (share.sender._id) {
      return true;
    } else {
      return share.sender.includes(authUser._id);
    }
  });

  const [isShare, setIsShare] = useState({
    share: feedType === "shared" ? sender : sender.includes(true),
    shareCount: post.shares.length,
  });

  const handleSharePost = (postId, receiverId) => {
    sharePost({ postId, receiverId, seen: postSeen });

    setIsShare({
      share: isShare.share ? true : true,
      shareCount: isShare.share ? isShare.shareCount : isShare.shareCount + 1,
    });
  };

  //^check is my post or not
  const postOwner = post.user;
  const isMyPost = authUser._id === postOwner._id;

  const handleDeletePost = () => {
    deletePost(post._id);
  };

  const handlePostComment = (e) => {
    e.preventDefault();

    comment &&
      setAllComments((prev) => [
        ...prev,
        {
          text: comment,
          user: authUser,
        },
      ]);

    setIsCommenting(true);
    //^ send comment to server
    comments({ postId: post._id, text: comment, seen: postSeen });

    setComment("");

    setTimeout(() => {
      setIsCommenting(false);
    }, 1000);
  };

  const handleLikePost = (postId) => {
    LikeUnlike({ postId, seen: postSeen });

    setIsLiked({
      liked: !isLiked.liked,
      likesCount: isLiked.liked
        ? isLiked.likesCount - 1
        : isLiked.likesCount + 1,
    });
  };

  const handleSavePost = (postId) => {
    //TODO: save post
    savePost({ postId, seen: postSeen });

    setIsSaved({
      saved: !isSaved.saved,
    });
  };

  //^ format date here

  const formattedDate = formatDate(post.createdAt);

  const isAuthCommented = allComments
    .map((comment) => comment.user._id)
    .includes(authUser._id);

  return (
    <>
      {feedType === "shared" &&
        post.shares.map((share) => (
          <div
            key={share._id}
            className="flex gap-2 items-start p-4 border-b border-gray-700"
          >
            <div className="avatar">
              <Link
                to={`/profile/${share.sender.username}`}
                className="size-12 rounded-full overflow-hidden"
              >
                <img
                  src={
                    share.sender.profileImg || "/avatar-placeholder-image.jpg"
                  }
                />
              </Link>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex gap-2 items-center">
                <Link
                  to={`/profile/${share.sender.username}`}
                  className="font-bold"
                >
                  {share.sender.fullName}
                </Link>
                <span className="text-gray-700 flex gap-1 text-sm">
                  <Link to={`/profile/${share.sender.username}`}>
                    @{share.sender.username}
                  </Link>
                </span>
              </div>
              <div>
                <span>
                  This post has been shared by {share.sender.fullName}
                </span>
              </div>
            </div>
          </div>
        ))}
      <div
        className="flex gap-2 items-start p-4 border-b border-gray-700"
        onClick={() =>
          setPostSeen({
            seen: postSeen.seen ? true : true,
            seenCount: postSeen.seen
              ? postSeen.seenCount
              : postSeen.seenCount + 1,
          })
        }
      >
        <div className="avatar">
          <Link
            to={`/profile/${postOwner.username}`}
            className="w-8 rounded-full overflow-hidden"
          >
            <img
              src={postOwner.profileImg || "/avatar-placeholder-image.jpg"}
            />
          </Link>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex gap-2 items-center">
            <Link to={`/profile/${postOwner.username}`} className="font-bold">
              {postOwner.fullName}
            </Link>
            <span className="text-gray-700 flex gap-1 text-sm">
              <Link to={`/profile/${postOwner.username}`}>
                @{postOwner.username}
              </Link>
              <span>·</span>
              <span>{formattedDate}</span>
            </span>
            {isMyPost && (
              <span className="flex justify-end flex-1">
                {!isPending && (
                  <FaTrash
                    className="cursor-pointer hover:text-red-500"
                    onClick={handleDeletePost}
                  />
                )}
                {isPending && (
                  <span className="loading loading-spinner loading-sm"></span>
                )}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-3 overflow-hidden">
            <span>{post.text}</span>
            {post.img && (
              <img
                src={post.img}
                className="h-80 object-contain rounded-lg border border-gray-700"
                alt=""
              />
            )}
          </div>
          <div className="flex justify-between mt-3">
            <div className="flex gap-4 items-center w-2/3 justify-between">
              {isCommenting ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <div
                  className="flex gap-1 items-center cursor-pointer group"
                  onClick={() =>
                    document
                      .getElementById("comments_modal" + post._id)
                      .showModal()
                  }
                >
                  <FaRegComment
                    className={`size-4 group-hover:text-sky-400 ${
                      isAuthCommented ? "text-sky-400" : "text-slate-500"
                    }`}
                  />
                  <span
                    className={`text-sm group-hover:text-sky-400 ${
                      isAuthCommented ? "text-sky-400" : "text-slate-500"
                    }`}
                  >
                    {allComments.length}
                  </span>
                </div>
              )}
              {/* We're using Modal Component from DaisyUI */}
              <dialog
                id={`comments_modal${post._id}`}
                className="modal border-none outline-none"
              >
                <div className="modal-box rounded border border-gray-600">
                  <h3 className="font-bold text-lg mb-4">COMMENTS</h3>
                  <div className="flex flex-col gap-3 max-h-60 overflow-auto">
                    {allComments.length === 0 && (
                      <p className="text-sm text-slate-500">
                        No comments yet 🤔 Be the first one 😉
                      </p>
                    )}
                    {allComments.map((comment, idx) => (
                      <div
                        key={`comment_${comment._id}-${idx}`}
                        className="flex gap-2 items-start"
                      >
                        <div className="avatar">
                          <div className="w-8 rounded-full">
                            <img
                              src={
                                comment.user.profileImg ||
                                "/avatar-placeholder-image.jpg"
                              }
                            />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <span className="font-bold">
                              {comment.user.fullName}
                            </span>
                            <span className="text-gray-700 text-sm">
                              @{comment.user.username}
                            </span>
                          </div>
                          <div className="text-sm">{comment.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <form
                    className="flex gap-2 items-center mt-4 border-t border-gray-600 pt-2"
                    onSubmit={handlePostComment}
                  >
                    <textarea
                      className="textarea w-full p-1 rounded text-md resize-none border focus:outline-none  border-gray-800"
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <button className="btn btn-primary rounded-full btn-sm text-white px-4">
                      {isCommenting ? (
                        <span className="loading loading-spinner loading-md"></span>
                      ) : (
                        "Post"
                      )}
                    </button>
                  </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button className="outline-none">close</button>
                </form>
              </dialog>
              <div
                className="flex gap-1 items-center cursor-pointer group"
                onClick={() =>
                  document.getElementById("share_modal" + post._id).showModal()
                }
              >
                <Link to={`/post/share/${post._id}`}>
                  <BiRepost
                    className={`size-6 group-hover:text-green-500 ${
                      isShare.share ? "text-green-500" : "text-slate-500"
                    }`}
                  />
                </Link>
                <span className="text-sm text-slate-500 group-hover:text-green-500">
                  {isShare.shareCount}
                </span>
              </div>
              {/* We're using Modal Component from DaisyUI */}
              <dialog
                id={`share_modal${post._id}`}
                className="modal border-none outline-none"
              >
                <div className="modal-box max-w-80 rounded bg-[#16181C]">
                  <p className="font-bold text-lg text-center mb-4">
                    Whom to share
                  </p>
                  <div className="bg-[#16181C] sticky ">
                    <div className="flex flex-col gap-4">
                      {/* item */}
                      {isRefetchingShare && (
                        <>
                          <RightPanelSkeleton />
                          <RightPanelSkeleton />
                          <RightPanelSkeleton />
                          <RightPanelSkeleton />
                        </>
                      )}

                      {suggestedFollowers?.length !== 0 &&
                        !isRefetchingShare &&
                        suggestedFollowers?.map((user) => (
                          <div
                            key={user._id}
                            className="flex items-center justify-evenly gap-4"
                          >
                            <Link to={`/profile/${user.username}`}>
                              <div className="flex gap-2 items-center">
                                <div className="avatar">
                                  <div className="w-8 rounded-full">
                                    <img
                                      src={
                                        user.profileImg ||
                                        "/avatar-placeholder-image.jpg"
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-semibold tracking-tight truncate w-28">
                                    {user.fullName}
                                  </span>
                                  <span className="text-sm text-slate-500">
                                    @{user.username}
                                  </span>
                                </div>
                              </div>
                            </Link>

                            <div>
                              <button
                                className="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
                                disabled={isPendingShare}
                                onClick={() =>
                                  handleSharePost(post._id, user._id)
                                }
                              >
                                {isPendingShare ? (
                                  <span className="loading loading-spinner loading-sm"></span>
                                ) : (
                                  "Share"
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      {suggestedFollowers?.length === 0 &&
                        !isRefetchingShare && (
                          <p className="text-sm text-slate-500 text-center">
                            No one to share with
                          </p>
                        )}
                    </div>
                  </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button className="outline-none">close</button>
                </form>
              </dialog>
              {isPendingLike ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <div
                  className="flex gap-1 items-center group cursor-pointer"
                  onClick={() => handleLikePost(post._id)}
                >
                  {!isLiked.liked && (
                    <FaRegHeart className="w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500" />
                  )}
                  {isLiked.liked && (
                    <FaRegHeart className="w-4 h-4 cursor-pointer text-pink-500 " />
                  )}

                  <span
                    className={`text-sm text-slate-500 group-hover:text-pink-500 ${
                      isLiked.liked ? "text-pink-500" : "text-slate-500"
                    }`}
                  >
                    {isLiked.likesCount}
                  </span>
                </div>
              )}
            </div>
            <div className="flex w-1/3 justify-end gap-2 items-center">
              <FaChartSimple
                className={`size-4 ${
                  postSeen.seenCount ? "text-blue-600" : "text-slate-500"
                }`}
              />
              <span
                className={`text-sm  hover:text-sky-400 ${
                  postSeen.seenCount ? "text-blue-500" : "text-slate-500"
                }`}
              >
                {postSeen.seenCount}
              </span>
            </div>
            <div className="flex w-1/3 justify-end gap-2 items-center">
              {isPendingSave ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <FaRegBookmark
                  className={`size-4 hover:text-amber-500 cursor-pointer  ${
                    isSaved.saved ? "text-amber-400" : "text-slate-500"
                  }`}
                  onClick={() => handleSavePost(post._id)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Post;
