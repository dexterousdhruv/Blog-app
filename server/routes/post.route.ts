import { Router } from "express";
import { verifyUser } from "../utils/verifyUser";
import { createPost, deletePost, getAllPosts, getPostById, updatePost } from "../controllers/post.controller";

const router = Router()

router.post("/", verifyUser, createPost);

// Get all Posts
router.get("/", verifyUser, getAllPosts);

// Get a specific Post by ID
router.get("/:id", verifyUser, getPostById);

// Update a Post by ID
router.put("/:id", verifyUser, updatePost);

// Delete a Post by ID
router.delete("/:id", verifyUser, deletePost);

export default router