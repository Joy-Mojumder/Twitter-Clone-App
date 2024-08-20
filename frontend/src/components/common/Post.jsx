import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useLikeUnlikePosts } from "../../hooks/useLikeUnlikePosts";
import { useCommenting } from "../../hooks/useCommenting";
import { useDeletePost } from "../../hooks/useDeletePost";
import { formatDate } from "../../utils/date";

const Post = ({ post }) => {
  // ^ set comment
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState([...post.comments]);
  const { comments } = useCommenting();
  const [isCommenting, setIsCommenting] = useState(false);

  //^ get auth user from data query
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { deletePost, isPending } = useDeletePost();

  //^ use like unlike posts
  const { LikeUnlike, isPendingLike } = useLikeUnlikePosts();

  const [isLiked, setIsLiked] = useState({
    liked: post.likes.includes(authUser?._id),
    likesCount: post.likes.length,
  });

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
    comments({ postId: post._id, text: comment });

    setComment("");

    setTimeout(() => {
      setIsCommenting(false);
    }, 1000);
  };

  const handleLikePost = (postId) => {
    LikeUnlike(postId);

    setIsLiked({
      liked: !isLiked.liked,
      likesCount: isLiked.liked
        ? isLiked.likesCount - 1
        : isLiked.likesCount + 1,
    });
  };

  //^ format date here

  const formattedDate = formatDate(post.createdAt);

  return (
    <>
      <div className="flex gap-2 items-start p-4 border-b border-gray-700">
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
                  <FaRegComment className="w-4 h-4  text-slate-500 group-hover:text-sky-400" />
                  <span className="text-sm text-slate-500 group-hover:text-sky-400">
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
              <div className="flex gap-1 items-center group cursor-pointer">
                <BiRepost className="w-6 h-6  text-slate-500 group-hover:text-green-500" />
                <span className="text-sm text-slate-500 group-hover:text-green-500">
                  0
                </span>
              </div>
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
              <FaRegBookmark className="w-4 h-4 text-slate-500 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Post;
