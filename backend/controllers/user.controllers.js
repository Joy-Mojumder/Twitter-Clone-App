import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";
import User from "../models/user.models.js";
import Notification from "../models/notification.model.js";

// & getUserProfile function
export const getUserProfile = async (req, res) => {
  // ^ destructuring req.params for username
  const { username } = req.params;

  try {
    // ^ find user in database
    const user = await User.findOne({ username }).select("-password");

    // ^ check if user exists in database
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // ^if user exists send response with user data
    res.status(200).json(user);
  } catch (error) {
    // ^ error handling for getUserProfile controller
    console.log("Error in getUserProfile controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// & followUnfollowUser function
export const followUnfollowUser = async (req, res) => {
  try {
    // ^ destructuring req.params for userId
    const { userId } = req.params;

    const currentUser = await User.findById(req.user._id);
    const userToModify = await User.findById(userId);

    // * check if user is trying to follow/unfollow himself
    if (userId === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You can't follow/unfollow yourself" });
    }

    // * check if user exists in database
    if (!currentUser || !userToModify) {
      return res.status(404).json({ error: "User not found" });
    }

    // * check if user is already following or not
    const isFollowing = currentUser.following.includes(userId);

    // * update followers and following counts
    if (isFollowing) {
      // todo unfollow user
      await User.findByIdAndUpdate(userId, {
        $pull: { followers: req.user._id },
      });
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { following: userId },
      });

      // * optional message for unfollow
      res.status(200).json({
        message: `${currentUser.username} is no longer following ${userToModify.username}`,
      });
    } else {
      // todo follow user
      await User.findByIdAndUpdate(userId, {
        $push: { followers: req.user._id },
      });
      await User.findByIdAndUpdate(req.user._id, {
        $push: { following: userId },
      });

      // ~ send notification for follow
      const newNotification = new Notification({
        sender: req.user._id,
        receiver: userId,
        type: "follow",
      });
      await newNotification.save();

      // * optional message for follow
      res.status(200).json({
        message: `${currentUser.username} is now following ${userToModify.username}`,
      });
    }
  } catch (error) {
    // ^ error handling for followUnfollowUser controller
    console.log("Error in followUnfollowUser controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// & getSuggestedUsers function

export const getSuggestedUsers = async (req, res) => {
  // ^ get user id from req.user object
  try {
    const userId = req.user._id;

    // ^ get user followed by me from database
    const userFollowedByMe = await User.findById(userId).select("following");

    // ^ get 10 random users from database
    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      {
        $sample: { size: 10 },
      },
    ]);

    // ^ filter out users that are already followed by me
    const filteredUsers = users.filter((user) => {
      return !userFollowedByMe.following.includes(user._id);
    });

    // * get 4 suggested users from filtered users
    const suggestedUsers = filteredUsers.slice(0, 4);

    // * remove password from suggested users
    suggestedUsers.forEach((user) => {
      user.password = null;
    });

    // * send response with 4 suggested users
    res.status(200).json(suggestedUsers);
  } catch (error) {
    // ^ error handling for getSuggestedUsers controller
    console.log("Error in getSuggestedUsers controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// & updateUser function
export const updateUser = async (req, res) => {
  // ^ destructuring req.body for fullName, username, email, currentPassword, newPassword , bio & links
  const {
    fullName,
    username,
    email,
    currentPassword,
    newPassword,
    bio,
    links,
  } = req.body;

  //^ destructuring profileImg & coverImg from req.body
  const { profileImg, coverImg } = req.body;

  //^ defining userId from req.user._id
  const userId = req.user._id;

  try {
    // * check if user exists in database
    let user = await User.findById(userId);

    // * check if user exists in database
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // * check if new password & current password both provided or not
    if (
      (!newPassword && currentPassword) ||
      (!currentPassword && newPassword)
    ) {
      return res.status(400).json({
        error: "Please provide both current password and new password",
      });
    }

    //~==== if new password & current password both provided
    if (newPassword && currentPassword) {
      // * storing isPasswordMatch in variable to check if current password matches with database password
      const isPasswordMatch = await bcrypt.compare(
        currentPassword,
        user.password
      );

      // * check if current password matches with database password
      if (!isPasswordMatch) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }

      // * check if new password is less than 6 characters long
      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ error: "New password must be at least 6 characters long" });
      }

      // * salt & hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // * update password in database
      user.password = hashedPassword;
    }
    //^ update profileImg
    if (profileImg) {
      // * delete old profileImg from cloudinary
      if (user.profileImg) {
        // todo get old profileImg id to delete from cloudinary
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      }
      // * upload profileImg to cloudinary and store url in profileImg variable
      const uploadResponse = await cloudinary.uploader.upload(profileImg);

      profileImg = uploadResponse.secure_url;
    }

    //^ update coverImg in database
    if (coverImg) {
      // * delete old coverImg from cloudinary
      if (user.coverImg) {
        // todo get old coverImg id to delete from cloudinary
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
      }
      // * upload coverImg to cloudinary and store url in coverImg variable
      const uploadResponse = await cloudinary.uploader.upload(coverImg);

      coverImg = uploadResponse.secure_url;
    }
    // ^ update all fields in database
    user.fullName = fullName || user.fullName;
    user.username = username || user.username;
    user.email = email || user.email;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;
    user.bio = bio || user.bio;
    user.links = links || user.links;

    // * save user in database
    user = await user.save();

    // * remove password from user
    user.password = null;

    // * send response with updated user
    res.status(200).json(user);
  } catch (error) {
    // ^ error handling for updateUser controller
    console.log("Error in updateUser controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
