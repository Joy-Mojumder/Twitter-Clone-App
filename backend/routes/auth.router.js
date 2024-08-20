import {
  signup,
  login,
  logout,
  getMe,
} from "../controllers/auth.controller.js";
import express from "express";

import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

// * get me route
router.get("/me", protectRoute, getMe);

//* signup route
router.post("/signup", signup);

//* login route
router.post("/login", login);

//* logout route
router.post("/logout", logout);

export default router;