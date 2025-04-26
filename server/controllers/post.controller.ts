import { NextFunction, Request, Response } from "express";
import { prismaDb } from "../connect/db";
import { errorHandler } from "../utils/error";
const { randomUUID } = require("crypto");

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    userId,
    body: { title, content, cover = null },
  } = req as any;

  if (!title || !content) {
    console.log(title, content);
    return next(errorHandler(403, "You are not allowed to create a post"));
  }

  try {
    const [existingTitle] = (await prismaDb.$queryRaw`
      SELECT * FROM "Post"
      WHERE title = ${title}
      LIMIT 1;
    `) as any;

    if (existingTitle) {
      return next(errorHandler(403, "Title already taken!"));
    }

    const [user] = (await prismaDb.$queryRaw`
      SELECT * FROM "User"
      WHERE id = ${userId}
      LIMIT 1;
    `) as any;

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    const [newPost] = (await prismaDb.$queryRaw`
    INSERT INTO "Post" (id, "createdAt", "updatedAt", title, content, cover, author, "userId")
    VALUES (
      ${randomUUID()},
      NOW(),
      NOW(),
      ${title},
      ${content},
      ${
        cover ||
        "https://contenthub-static.grammarly.com/blog/wp-content/uploads/2017/11/how-to-write-a-blog-post.jpeg"
      },
      ${user.username},
      ${userId}
    )
    RETURNING *;
  `) as any;

    res.status(201).json(newPost);
  } catch (e) {
    console.log("Error in create post controller", e);
    return next(errorHandler(500, "Server error, Please try again later!"));
  }
};

export const getAllPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req as any;

  try {
    const allPosts = (await prismaDb.$queryRaw`
      SELECT 
        u.id AS "userId",
        u.email,
        u."createdAt" AS "userCreatedAt",
        u."updatedAt" AS "userUpdatedAt",
        
        p.id AS "postId",
        p.title,
        p.content,
        p.cover,
        p.author,
        p."createdAt" AS "postCreatedAt",
        p."updatedAt" AS "postUpdatedAt"
      FROM "User" u
      LEFT JOIN "Post" p ON u.id = p."userId"
      WHERE u.id = ${userId};
    `) as any[];

    res.status(200).json(allPosts);
  } catch (e) {
    console.log("Error in get post controller", e);
    return next(errorHandler(500, "Server error, Please try again later!"));
  }
};

export const getPostById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  if (!id) {
    return next(errorHandler(404, "Invalid credential!"));
  }

  try {
    const [post] = (await prismaDb.$queryRaw`
      SELECT * FROM "Post"
      WHERE id = ${id}
      LIMIT 1;
    `) as any[];

    if (!post) {
      return next(errorHandler(404, "No post found"));
    }

    res.status(200).json(post);
  } catch (e) {
    console.log("Error in get post by id controller", e);
    return next(errorHandler(500, "Server error, Please try again later!"));
  }
};

export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const {
    userId,
    body: { title, content, cover },
  } = req as any;

  if (!id) {
    return next(errorHandler(404, "Invalid credential!"));
  }

  try {
    const [post] = (await prismaDb.$queryRaw`
      SELECT * FROM "Post"
      WHERE id = ${id}
      LIMIT 1;
    `) as any[];

    if (!post) {
      return next(errorHandler(404, "No post found"));
    }

    if (post.userId !== userId) {
      return next(errorHandler(401, "You are not allowed to delete this post"));
    }

    const updateFields: string[] = [];
    const updateValues: any[] = [];
    let paramIndex = 1;

    if (title !== post.title) {
      updateFields.push(`"title" = $${paramIndex++}`);
      updateValues.push(title);
    }

    if (content !== post.content) {
      updateFields.push(`"content" = $${paramIndex++}`);
      updateValues.push(content);
    }

    if (cover !== post.cover) {
      updateFields.push(`"cover" = $${paramIndex++}`);
      updateValues.push(cover);
    }

    if (updateFields.length === 0) {
      res.status(200).json(post);
    }

    updateValues.push(id); // final param is for WHERE
    
    const updateQuery = `
    UPDATE "Post"
    SET ${updateFields.join(", ")}
    WHERE id = $${paramIndex}
    RETURNING *;
  `;

    const [updatedPost] = await prismaDb.$queryRawUnsafe(
      updateQuery,
      ...updateValues
    ) as any;

    res.status(200).json(updatedPost);
  
  } catch (e) {
    console.log("Error in update post by id controller", e);
    return next(errorHandler(500, "Server error, Please try again later!"));
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req as any;
  const { id } = req.params;

  if (!id) {
    return next(errorHandler(404, "Invalid credential!"));
  }

  try {
    const [post] = (await prismaDb.$queryRaw`
      SELECT * FROM "Post"
      WHERE id = ${id}
      LIMIT 1;
    `) as any[];

    if (!post) {
      return next(errorHandler(404, "No post found"));
    }

    if (post.userId !== userId) {
      return next(errorHandler(401, "You are not allowed to delete this post"));
    }

    await prismaDb.$executeRaw`
    DELETE FROM "Post"
    WHERE id = ${id};
  `;

    res.status(200).json({ message: "success" });
  } catch (e) {
    console.log("Error in delete post by id controller", e);
    return next(errorHandler(500, "Server error, Please try again later!"));
  }
};
