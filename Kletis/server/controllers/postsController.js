const Post = require("../models/Post");
const Tractor = require("../models/Tractor");
const User = require("../models/User");
const mongoose = require("mongoose");

// Utility function to handle expand
const applyExpand = (query, expand) => {
  if (expand) {
    const expandFields = expand.split(",");
    if (expandFields.includes("tractor")) {
      query = query.populate("tractor", "name description");
    }
    if (expandFields.includes("author")) {
      query = query.populate("author", "username email");
    }
  }
  return query;
};

// GET all posts with expand options
exports.getAllPosts = async (req, res) => {
  try {
    const { expand } = req.query;
    let postsQuery = Post.find();

    // Apply expand logic
    postsQuery = applyExpand(postsQuery, expand);

    const posts = await postsQuery;
    res.json(posts);
  } catch (error) {
    console.error("Error fetching all posts:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// GET posts by tractor
exports.getPostsByTractor = async (req, res) => {
  try {
    const { expand } = req.query;
    const tractorId = req.params.tractorId;

    if (!mongoose.Types.ObjectId.isValid(tractorId)) {
      return res.status(400).json({ error: "Invalid Tractor ID" });
    }

    const tractorCheck = await Tractor.findById(tractorId);
    if (!tractorCheck) {
      return res.status(404).send({ error: "Tractor Not Found" });
    }

    let postQuery = Post.find({ tractor: tractorId });

    // Apply expand logic
    postQuery = applyExpand(postQuery, expand);

    const posts = await postQuery;
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts by tractor:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// GET posts by user
exports.getPostsByUser = async (req, res) => {
  try {
    const { expand } = req.query;
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }

    const userCheck = await User.findById(userId);
    if (!userCheck) {
      return res.status(404).send({ error: "User Not Found" });
    }

    let postQuery = Post.find({ author: userId });

    // Apply expand logic
    postQuery = applyExpand(postQuery, expand);

    const posts = await postQuery;
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts by user:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// GET a single post by ID
exports.getPostById = async (req, res) => {
  try {
    const { expand } = req.query;
    const postId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid Post ID" });
    }

    let postQuery = Post.findById(postId);

    // Apply expand logic
    postQuery = applyExpand(postQuery, expand);

    const post = await postQuery;
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { title, content, author, tractor } = req.body;

    // Validate inputs
    if (!title || !content || !author || !tractor) {
      return res
        .status(422)
        .json({ error: "Title, content, author, and tractor are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(author)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(tractor)) {
      return res.status(400).json({ error: "Invalid Tractor ID" });
    }

    const authorCheck = await User.findById(author);
    const tractorCheck = await Tractor.findById(tractor);

    if (!authorCheck) {
      return res.status(404).json({ error: "Author not found" });
    }
    if (!tractorCheck) {
      return res.status(404).json({ error: "Tractor not found" });
    }

    const newPost = new Post({
      title,
      content,
      created_at: new Date(),
      author,
      tractor,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Update an existing post
exports.updatePost = async (req, res) => {
  try {
    const { title, content, author, tractor } = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Post ID" });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.author = author || post.author;
    post.tractor = tractor || post.tractor;
    post.updated_at = new Date();

    await post.save();
    res.json(post);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Post ID" });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const deletedPost = await Post.findByIdAndDelete(id);
    res.status(200).json(deletedPost);
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Server error" });
  }
};
