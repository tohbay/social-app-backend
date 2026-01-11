import User from "../models/userModel.js";
import Post from "../models/postModel.js";

const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.status(200).json({ post });
  } catch (error) {
    console.log("Error from getPost", error.message);
    res.status(500).json({ message: error.message });
  }
};

const createPost = async (req, res) => {
  try {
    const { postedBy, text, img } = req.body;

    if (!postedBy || !text)
      return res
        .status(400)
        .json({ message: "Postedby and text fields are required" });

    const user = await User.findById(postedBy);

    if (!user) res.status(404).json({ message: "User not found!" });

    if (user._id.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Unauthorized to create post" });

    const maxLength = 500;

    if (text.length > maxLength)
      return res
        .status(400)
        .json({ message: `Text must be less thatn ${maxLength} characters` });

    const newPost = new Post({ postedBy, text, img });
    await newPost.save();

    res.status(201).json({ message: "Post created successfully", newPost });
  } catch (error) {
    console.log("Error from createPost", error.message);
    res.status(500).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.postedBy.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Unauthorized to delete post" });

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log("Error from deletePost", error.message);
    res.status(500).json({ message: error.message });
  }
};

export { getPost, createPost, deletePost };
