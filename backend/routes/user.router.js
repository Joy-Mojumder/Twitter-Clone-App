import express from "express";

// & protectRoute middleware function
import { protectRoute } from "../middleware/protectRoute.js";

// & getUserProfile controller function
import {
  followUnfollowUser,
  getSuggestedUsers,
  getUserProfile,
  updateUser,
} from "../controllers/user.controllers.js";

// & initialize router
const router = express.Router();

// ^ all routes are handled here
router.get("/profile/:username", protectRoute, getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.post("/follow/:userId", protectRoute, followUnfollowUser);
router.post("/update", protectRoute, updateUser);

export default router;
