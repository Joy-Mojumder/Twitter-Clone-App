import express from "express";
// & protectRoute middleware & controller function
import { protectRoute } from "../middleware/protectRoute.js";
import {
  commentPost,
  createPost,
  deletePost,
  getAllPosts,
  getFollowingPosts,
  getLikedPosts,
  getUserPosts,
  likeUnlikePost,
  savePosts,
  getSavedPosts,
  sharePost,
  getSharedPosts,
} from "../controllers/post.controller.js";

const router = express.Router();

//& all routes are handled here by controllers
router.get("/all", protectRoute, getAllPosts);
router.get("/user/:username", protectRoute, getUserPosts);
router.get("/following", protectRoute, getFollowingPosts);
router.get("/liked/:userId", protectRoute, getLikedPosts);
router.get("/saved/:userId", protectRoute, getSavedPosts);
router.get("/shared/:userId", protectRoute, getSharedPosts);
router.post("/save/:postId", protectRoute, savePosts);
router.post("/share/:postId", protectRoute, sharePost);
router.post("/create", protectRoute, createPost);
router.post("/like/:postId", protectRoute, likeUnlikePost);
router.post("/comment/:postId", protectRoute, commentPost);
router.delete("/:postId", protectRoute, deletePost);

export default router;
