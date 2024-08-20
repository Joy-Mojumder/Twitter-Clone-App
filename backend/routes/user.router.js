import express from "express";

// & protectRoute middleware function
import { protectRoute } from "../middleware/protectRoute.js";

// & getUserProfile controller function
import {
  followUnfollowUser,
  getSuggestedUsers,
  getUserProfile,
  updateUser,
  updateImgUser,
} from "../controllers/user.controller.js";

// & initialize router
const router = express.Router();

// ^ all routes are handled here
router.get("/profile/:username", protectRoute, getUserProfile); // get user profile
router.get("/suggested", protectRoute, getSuggestedUsers); // get suggested users
router.post("/follow/:userId", protectRoute, followUnfollowUser); // follow/unfollow user
router.post("/update", protectRoute, updateUser); // update user profile
router.post("/updateImg", protectRoute, updateImgUser); // update user profile image

export default router;
