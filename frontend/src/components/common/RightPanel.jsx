import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import { useRTSuggestedUsers } from "../../hooks/useRTSuggestedUsers";
import { useFollowUnfollowUsers } from "../../hooks/useFollowUnfollowUsers";

const RightPanel = () => {
  const { suggestedRtUsers, isLoadingSuggested } = useRTSuggestedUsers();

  const { followUnfollowUser, isPendingFollowUnfollow } =
    useFollowUnfollowUsers();

  const handleFollowUnfollowUser = (userId) => {
    followUnfollowUser(userId);
  };
  return (
    <div className="hidden lg:block my-4 mx-2">
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
              <Link
                to={`/profile/${user.username}`}
                className="flex items-center justify-between gap-4"
                key={user._id}
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
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};
export default RightPanel;
