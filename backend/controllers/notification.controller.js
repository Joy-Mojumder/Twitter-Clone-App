import Notification from "../models/notification.model.js";

// & getNotifications function
export const getNotifications = async (req, res) => {
  try {
    // ^ get userId from req.user_id object
    const userId = req.user._id;

    // * find notifications based on userId and populate sender with username and profileImg
    const notifications = await Notification.find({
      receiver: userId,
    }).populate({
      path: "sender",
      select: "username profileImg",
    });

    //* update notifications as read
    await Notification.updateMany({ receiver: userId }, { read: true });

    // * send response with notifications
    res.status(200).json(notifications);
  } catch (error) {
    // ^ error handling for getNotifications controller
    console.log("Error in getNotifications controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// & deleteNotifications function
export const deleteAllNotifications = async (req, res) => {
  try {
    // ^ get userId from req.user_id object
    const userId = req.user._id;

    //* check if any notifications exist or not
    const notifications = await Notification.find({ receiver: userId });
    if (!notifications || notifications.length === 0) {
      return res.status(404).json({ error: "No notifications found" });
    }

    // * delete notifications based on userId
    await Notification.deleteMany({ receiver: userId });

    // * send response
    res.status(200).json({ message: `Notifications deleted successfully` });
  } catch (error) {
    // ^ error handling for deleteNotifications controller
    console.log("Error in deleteNotifications controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// & deleteSelectedNotification function
export const deleteSelectedNotification = async (req, res) => {
  try {
    // ^ get notificationId from req.params
    const notificationId = req.params.notificationId;

    // ^ get userId from req.user_id object
    const userId = req.user._id;

    //* check if notification exists or not
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res
        .status(404)
        .json({ error: "this notification does not exist" });
    }

    //* check if notification belongs to user or not
    if (notification.receiver.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "you are not authorized to delete this notification" });
    }

    // * delete notification based on notificationId
    await Notification.findByIdAndDelete(notificationId);

    // * send response
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    // ^ error handling for deleteSelectedNotification controller
    console.log("Error in deleteSelectedNotification controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
