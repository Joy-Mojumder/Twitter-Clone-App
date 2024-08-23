import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import { useRTSuggestedUsers } from "../../hooks/useRTSuggestedUsers";
import { useFollowUnfollowUsers } from "../../hooks/useFollowUnfollowUsers";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const RightPanel = () => {
  const { suggestedRtUsers, isLoadingSuggested } = useRTSuggestedUsers();

  const navigate = useNavigate();

  const { followUnfollowUser, isPendingFollowUnfollow } =
    useFollowUnfollowUsers();

  const handleFollowUnfollowUser = (userId) => {
    followUnfollowUser(userId);
  };

  const rightPanelVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.5,
        staggerChildren: 0.5,
      },
    },
  };

  const rightPanelItemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <motion.div
      className="hidden lg:block my-4 mx-2"
      variants={rightPanelVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0 }}
    >
      <div className="bg-[#16181C] p-4 rounded-md sticky top-2">
        <p className="font-bold">Who to follow</p>
        <div className="flex flex-col gap-4">
          {/* item */}
          {isLoadingSuggested && (
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          )}
          {!isLoadingSuggested &&
            suggestedRtUsers?.map((user) => (
              <motion.div
                key={user._id}
                className="flex items-center justify-between gap-4"
                variants={rightPanelItemVariants}
                onClick={() => navigate(`/profile/${user.username}`)}
              >
                <div className="flex gap-2 items-center">
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img
                        src={user.profileImg || "/avatar-placeholder-image.jpg"}
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
                <div>
                  <button
                    className="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
                    onClick={() => handleFollowUnfollowUser(user._id)}
                    disabled={isPendingFollowUnfollow}
                  >
                    {isPendingFollowUnfollow ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      "Follow"
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </motion.div>
  );
};
export default RightPanel;
