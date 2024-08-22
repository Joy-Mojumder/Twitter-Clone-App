import { v2 as cloudinary } from "cloudinary";
//^ import Post and User models
import Post from "../models/post.model.js";
import User from "../models/user.models.js";
import Notification from "../models/notification.model.js";

// & createPost function
export const createPost = async (req, res) => {
  try {
    //^ destructuring req.body for text and image
    const { text } = req.body;

    let { img } = req.body;

    //* getting userId from req.user._id

    const userId = req.user._id.toString();

    //* check if user exists in database

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: "User not found" });

    //* if user exists check if text or img is present

    if (!text && !img) {
      return res.status(400).json({ error: "post must have text or img" });
    }

    //* if img is present, upload img to cloudinary
    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    //^ all fields are present,then create post
    const newPost = new Post({
      user: userId,
      text,
      img,
    });

    //^ save post
    await newPost.save();

    //* send response with new post
    return res.status(201).json(newPost);
  } catch (error) {
    //^ error handling for createPost controller
    res.status(500).json({ error: `Internal server error` });
  }
};

// & deletePost function
export const deletePost = async (req, res) => {
  try {
    //^ find post from req.params.postId
    const post = await Post.findById(req.params.postId);

    //^ check if post exists in database or not
    if (!post) return res.status(404).json({ error: "Post not found" });

    //^ check if user is authorized to delete the post
    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: "You are not authorized to delete this post" });
    }

    //*if post exists and user is authorized then delete image from cloudinary
    if (post.img) {
      await cloudinary.uploader.destroy(
        post.img.split("/").pop().split(".")[0]
      );
    }

    //^ delete post from database
    await Post.findByIdAndDelete(req.params.postId);

    //^ send response with success message
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    //^ error handling for deletePost controller
    res.status(500).json({ error: `Internal server error` });
  }
};

//& commentPost function
export const commentPost = async (req, res) => {
  try {
    //^ destructuring req.body for text
    const { text, seen } = req.body;

    //^ initializing postId & userId
    const postId = req.params.postId;
    const userId = req.user._id;

    //* check if user field text or not
    if (!text) {
      return res.status(400).json({ error: "Text field is required" });
    }

    //* check if the post exists or not
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    //* create comment object
    const comment = {
      user: userId,
      text,
    };
    //* push comment object in comments array of post
    post.comments.push(comment);

    //^ update seen field in post
    if (seen && !post.seen.includes(userId)) {
      post.seen.push(userId);
    }

    //^ save post in database
    await post.save();

    //* send notification to post.user
    const notification = new Notification({
      sender: userId,
      receiver: post.user,
      type: "comment",
      read: false,
    });

    //? save notification in database
    await notification.save();

    //^ send response with success message
    return res.status(200).json(post);
  } catch (error) {
    //^ error handling for commentPost controller
    res.status(500).json({ error: `Internal server error` });
  }
};

// & likeUnlikePost function
export const likeUnlikePost = async (req, res) => {
  const { seen } = req.body;
  try {
    //^ initializing postId
    const postId = req.params.postId;

    //^ initializing userId
    const userId = req.user._id;

    //^ check if post exists or not
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    //^ check if user already liked the post or not
    const isLikedPost = post.likes.includes(userId);
    if (isLikedPost) {
      //* if user already liked the post then pull userId from likes array
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });

      //^if user already likedPost then pull postId from likes array
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });
      //* send response with success message
      return res.status(200).json({ message: "Post unliked successfully" });
    } else {
      //* if user has not liked the post then push userId in likes array
      post.likes.push(userId);

      //^ update seen field in post
      if (seen && !post.seen.includes(userId)) {
        post.seen.push(userId);
      }

      //^ if user has not liked the post then push postId in likedPosts array
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });

      //? save post in database
      await post.save();

      //* send notification to post.user
      const notification = new Notification({
        sender: userId,
        receiver: post.user,
        type: "like",
        read: false,
      });

      //? save notification in database
      await notification.save();

      //* send response with success message
      return res.status(200).json({ message: "Post liked successfully" });
    }
  } catch (error) {
    //^ error handling for likeUnlikePost controller
    res.status(500).json({ error: `Internal server error` });
  }
};

//& getAllPosts function
export const getAllPosts = async (req, res) => {
  try {
    //! get all posts from database and sort them in descending order and populate(getting all details of user) user and comments from database
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    //* if any post does not exist then send an empty array
    if (posts.length === 0) return res.status(200).json([]);

    //* send response with success message
    return res.status(200).json(posts);
  } catch (error) {
    //^ error handling for getAllPosts controller
    res.status(500).json({ error: `Internal server error` });
  }
};

//& getLikedPosts function
export const getLikedPosts = async (req, res) => {
  try {
    //^ initializing userId
    const userId = req.params.userId;

    //^ check if user exists or not
    const user = await User.findById(userId);

    //^ if user does not exist then send user not found error
    if (!user) return res.status(404).json({ error: "User not found" });

    //* find all posts that user has liked & populate(getting all details of user) user and comments from database
    const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    //* send response with liked posts
    res.status(200).json(likedPosts);
  } catch (error) {
    //^ error handling for getLikedPosts controller
    res.status(500).json({ error: `Internal server error` });
  }
};

//& getFollowingPosts function
export const getFollowingPosts = async (req, res) => {
  try {
    //^ initializing userId
    const userId = req.user._id;

    //^ check if user exists or not
    const user = await User.findById(userId);

    //^ if user does not exist then send user not found error
    if (!user) return res.status(404).json({ error: "User not found" });

    //* find all posts that user is following , sort them in descending order and populate(getting all details of user) user and comments from database
    const followingPosts = await Post.find({ user: { $in: user.following } })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    //* send response with following posts
    res.status(200).json(followingPosts);
  } catch (error) {
    //^ error handling for getFollowingPosts controller
    res.status(500).json({ error: `Internal server error` });
  }
};

//& getUserPosts function
export const getUserPosts = async (req, res) => {
  try {
    //^ destructuring username from req.params
    const { username } = req.params;

    //^ check if user exists or not
    const user = await User.findOne({ username });

    //^ if user does not exist then send user not found error
    if (!user) return res.status(404).json({ error: "User not found" });

    //* find all posts that user has created & sort them in descending order and populate(getting all details of user) user and comments from database
    const userPosts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    //* send response with user posts
    res.status(200).json(userPosts);
  } catch (error) {
    //^ error handling for getUserPosts controller
    res.status(500).json({ error: `Internal server error` });
  }
};

//& savePost function
export const savePosts = async (req, res) => {
  const { postId } = req.params;

  const { seen } = req.body;
  const userId = req.user._id;
  try {
    //^ check if post exists or not
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ error: "Post not found" });

    //^ check if user already saved the post or not
    const isSaved = post.saves.includes(userId);

    if (isSaved) {
      //^ if user already saves the post then pull userId from saves array
      await Post.updateOne({ _id: postId }, { $pull: { saves: userId } });

      //^if user already savedPosts then pull postId from likes array
      await User.updateOne({ _id: userId }, { $pull: { savedPosts: postId } });

      return res.status(200).json({ message: "Post unsaved successfully" });
    } else {
      //* if user has not saved the post then push userId in likes array
      post.saves.push(userId);

      //^ update seen field in post
      if (seen && !post.seen.includes(userId)) {
        post.seen.push(userId);
      }

      //^ if user has not saved the post then push postId in savedPosts array
      await User.updateOne({ _id: userId }, { $push: { savedPosts: postId } });

      //? save post in database
      await post.save();

      return res.status(200).json({ message: "Post saved successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: `Internal server error` });
  }
};

//& getSavedPosts function
export const getSavedPosts = async (req, res) => {
  try {
    //^ initializing userId
    const userId = req.params.userId;

    //^ check if user exists or not
    const user = await User.findById(userId);

    //^ if user does not exist then send user not found error
    if (!user) return res.status(404).json({ error: "User not found" });

    //* find all posts that user has saved & populate(getting all details of user) user and comments from database
    const savedPosts = await Post.find({ _id: { $in: user.savedPosts } })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    //* send response with liked posts
    res.status(200).json(savedPosts);
  } catch (error) {
    //^ error handling for getLikedPosts controller
    res.status(500).json({ error: `Internal server error` });
  }
};

//& sharePost function
export const sharePost = async (req, res) => {
  const { postId } = req.params;
  const { receiverId, seen } = req.body;

  const userId = req.user._id;

  if (!receiverId) return res.status(404).json({ error: "Receiver not found" });

  if (!postId) return res.status(404).json({ error: "PostId not found" });

  try {
    //^ check if post exists or not
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ error: "Post not found" });

    // ^ get my followers from database
    const myFollowers = await User.findById(userId).select("followers");

    if (myFollowers.followers.includes(receiverId)) {
      const shareParticipant = {
        sender: userId,
        receiver: receiverId,
      };
      //* if user has not shared the post then push receiverId in likes array
      post.shares.push(shareParticipant);

      //^ if user has not shared the post then push postId in sharedPosts array
      await User.updateOne(
        { _id: receiverId },
        { $push: { sharedPosts: postId } }
      );

      //^ update seen field in post
      if (seen && !post.seen.includes(userId)) {
        post.seen.push(userId);
      }

      //? save post in database
      await post.save();

      //* send notification to post.user
      const notification = new Notification({
        sender: userId,
        receiver: receiverId,
        type: "share",
        read: false,
      });

      //? save notification in database
      await notification.save();

      return res.status(200).json({ message: "Post shared successfully" });
    } else {
      return res
        .status(404)
        .json({ error: "You can only share post with your followers" });
    }
  } catch (error) {
    res.status(500).json({ error: `Internal server error` });
  }
};

//& getSharedPosts function
export const getSharedPosts = async (req, res) => {
  try {
    //^ initializing userId
    const userId = req.params.userId;

    //^ check if user exists or not
    const user = await User.findById(userId);

    //^ if user does not exist then send user not found error
    if (!user) return res.status(404).json({ error: "User not found" });

    //* find all posts that other users have shared & populate(getting all details of user) user and comments from database
    const sharedPosts = await Post.find({ _id: { $in: user.sharedPosts } })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      })
      .populate({
        path: "shares.sender",
        select: "-password",
      });

    //* send response with liked posts
    res.status(200).json(sharedPosts);
  } catch (error) {
    res.status(500).json({ error: `Internal server error` });
  }
};
