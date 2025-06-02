// routes/posts.js
import express from "express";
import mongoose from "mongoose";
import Post from "../models/Post.js";

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const { title, content, authorId, isDraft, coverImage } = req.body;

    let baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    let slug = baseSlug;
    let count = 1;

    while (await Post.findOne({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    const post = await Post.create({
      title,
      slug,
      content,
      coverImage,
      author: authorId,
      isDraft,
    });

    res.status(201).json(post);
  } catch (err) {
    console.error("❌ Error creating post:", err); // More visibility
    res.status(500).json({ error: err.message });
  }
});

// GET /api/posts/slug/:slug
router.get("/slug/:slug", async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

router.put("/:slug", async (req, res) => {
  try {
    const { title, content, coverImage } = req.body;

    const newSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const updated = await Post.findOneAndUpdate(
      { slug: req.params.slug },
      {
        title,
        slug: newSlug,
        content,
        coverImage,
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Post not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update post" });
  }
});

// Get all posts by a user
router.get("/user/:id", async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.id }).sort({
      createdAt: -1,
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});
// Increment views
router.put("/slug/:slug/view", async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { views: 1 } },
      { new: true }
    );
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Failed to increment views" });
  }
});

// Like post
router.put("/slug/:slug/like", async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { likes: 1 } },
      { new: true }
    );
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Failed to like post" });
  }
});

export default router;
