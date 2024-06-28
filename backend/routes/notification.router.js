import express from "express";

// & protectRoute middleware function
import { protectRoute } from "../middleware/protectRoute.js";

//& all controllers here
import {
  getNotifications,
  deleteAllNotifications,
  deleteSelectedNotification,
} from "../controllers/notification.controller.js";

const router = express.Router();

// ^ all routes are handled here
router.get("/", protectRoute, getNotifications);
router.delete("/", protectRoute, deleteAllNotifications);
router.delete("/:notificationId", protectRoute, deleteSelectedNotification);

export default router;
