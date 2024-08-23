import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";

import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { BiTrash } from "react-icons/bi";
import { TfiCommentAlt } from "react-icons/tfi";
import { FaShareAlt } from "react-icons/fa";

import {
  useDeleteAllNotifications,
  useDeleteNotification,
  useNotifications,
} from "../../hooks/useNotifications";
import { formatDate } from "../../utils/date";

import { motion } from "framer-motion";

const NotificationPage = () => {
  const { notifications, isLoadingNotifications } = useNotifications();

  const { deleteNotification } = useDeleteNotification();

  const { deleteAllNotifications } = useDeleteAllNotifications();

  const notificationsVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const notificationsItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <>
      <motion.div
        className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen"
        variants={notificationsVariants}
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0 }}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <p className="font-bold">Notifications</p>
          <div className="dropdown ">
            <div tabIndex={0} role="button" className="m-1">
              <IoSettingsOutline className="w-4" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a onClick={deleteAllNotifications}>Delete all notifications</a>
              </li>
            </ul>
          </div>
        </div>
        {isLoadingNotifications && (
          <div className="flex justify-center h-full items-center">
            <LoadingSpinner size="lg" />
          </div>
        )}
        {notifications?.length === 0 && (
          <div className="text-center p-4 font-bold">
            No notifications found
          </div>
        )}
        {notifications?.map((notification) => (
          <motion.div
            className="border-b border-gray-700 flex justify-between"
            key={notification._id}
            variants={notificationsItemVariants}
          >
            <div className="flex gap-2 p-4">
              {notification.type === "follow" && (
                <FaUser className="w-7 h-7 text-primary" />
              )}
              {notification.type === "comment" && (
                <TfiCommentAlt
                  className="w-7 h-7 
                text-amber-500"
                />
              )}
              {notification.type === "like" && (
                <FaHeart className="w-7 h-7 text-red-500" />
              )}
              {notification.type === "share" && (
                <FaShareAlt className="w-7 h-7 text-sky-500" />
              )}

              <Link to={`/profile/${notification.sender.username}`}>
                <div className="avatar">
                  <div className="size-10 rounded-full">
                    <img
                      src={
                        notification.sender.profileImg ||
                        "/avatar-placeholder-image.jpg"
                      }
                    />
                  </div>
                  <p className="text-sm mx-2">
                    {formatDate(notification.createdAt)}
                  </p>
                </div>
                <div className="flex gap-1">
                  <span className="font-bold">
                    @{notification.sender.username}
                  </span>{" "}
                  {notification.type === "follow" && (
                    <span>started following you</span>
                  )}
                  {notification.type === "comment" && (
                    <span>commented on your post</span>
                  )}
                  {notification.type === "like" && <span>liked your post</span>}
                  {notification.type === "share" && (
                    <span>shared your post</span>
                  )}
                </div>
              </Link>
            </div>
            <div className="p-4">
              <BiTrash
                className="size-6 hover:text-red-500 cursor-pointer transition duration-200"
                onClick={() => deleteNotification(notification._id)}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
};
export default NotificationPage;
