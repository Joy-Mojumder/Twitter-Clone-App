import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { FcMindMap } from "react-icons/fc";
import { useQuery } from "@tanstack/react-query";
import { FaShareAlt } from "react-icons/fa";
import { BiSolidBookmarkAlt } from "react-icons/bi";

import { useLogout } from "../../hooks/useLogout";
import { useNotifications } from "../../hooks/useNotifications";

const Sidebar = () => {
  const { logout } = useLogout();

  const { notifications } = useNotifications();

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });

  return (
    <div className="md:flex-[2_2_0] w-16 sm:w-18 max-w-52">
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-16 sm:w-20 md:w-full">
        <Link to="/" className="flex justify-center md:justify-start">
          <FcMindMap className="size-8 md:size-10 lg:size-12 xl:size-14 relative" />
          <h1 className="text-2xl absolute top-3 left-14 font-mono hidden md:block">
            TWItt
          </h1>
        </Link>
        <ul className="flex flex-col gap-3 mt-4">
          <li className="flex justify-center md:justify-start">
            <NavLink
              to="/"
              className="flex gap-3 items-center hover:bg-stone-800 transition-all rounded-full duration-300 py-2 px-2 md:pl-2 md:pr-4 max-w-fit cursor-pointer"
            >
              <MdHomeFilled className="w-8 h-8" />
              <span className="text-lg hidden md:block">Home</span>
            </NavLink>
          </li>
          <li className="flex justify-center md:justify-start">
            <NavLink
              to="/notifications"
              className={`flex gap-3 items-center indicator hover:bg-stone-800 transition-all rounded-full duration-300 py-2 px-2 md:pl-2 md:pr-4 max-w-fit cursor-pointer ${
                notifications?.length > 0 && "bg-stone-950/80"
              }`}
            >
              <IoNotifications className="w-6 h-6" />
              <span className="text-lg hidden md:block">Notifications</span>
              <span className="indicator-item badge rounded-full bg-red-500">
                {notifications?.length > 0 && notifications?.length < 100
                  ? notifications?.length
                  : "99+"}
              </span>
            </NavLink>
          </li>

          <li className="flex justify-center md:justify-start">
            <NavLink
              to={`/profile/${authUser?.username}`}
              className="flex gap-3 items-center hover:bg-stone-800 transition-all rounded-full duration-300 py-2 px-2 md:pl-2 md:pr-4 max-w-fit cursor-pointer"
            >
              <FaUser className="w-6 h-6" />
              <span className="text-lg hidden md:block">Profile</span>
            </NavLink>
          </li>
          <li className="flex justify-center md:justify-start">
            <NavLink
              to={`/posts/saved/${authUser?._id}`}
              className="flex gap-3 items-center hover:bg-stone-800 transition-all rounded-full duration-300 py-2 px-2 md:pl-2 md:pr-4 max-w-fit cursor-pointer"
            >
              <BiSolidBookmarkAlt className="w-6 h-6" />
              <span className="text-lg hidden md:block">Saved Posts</span>
            </NavLink>
          </li>
          <li className="flex justify-center md:justify-start">
            <NavLink
              to={`/posts/shared/${authUser?._id}`}
              className="flex gap-3 items-center hover:bg-stone-800 transition-all rounded-full duration-300 py-2 px-2 md:pl-2 md:pr-4 max-w-fit cursor-pointer"
            >
              <FaShareAlt className="w-6 h-6" />
              <span className="text-lg hidden md:block">Share Posts</span>
            </NavLink>
          </li>
        </ul>

        {authUser && (
          <Link
            to={`/profile/${authUser?.username}`}
            className="mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full"
          >
            <div className="avatar hidden md:inline-flex">
              <div className="w-8 rounded-full ring ring-primary">
                <img
                  src={authUser?.profileImg || "/avatar-placeholder-image.jpg"}
                />
              </div>
            </div>
            <div className="flex justify-between flex-1">
              <div className="hidden md:block">
                <p className="text-white font-bold text-sm w-20 truncate">
                  {authUser?.fullName}
                </p>
                <p className="text-slate-500 text-sm">@{authUser?.username}</p>
              </div>
              <BiLogOut
                className="w-5 h-5 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                }}
              />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};
export default Sidebar;
