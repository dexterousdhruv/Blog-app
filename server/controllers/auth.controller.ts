import { NextFunction, Request, Response } from "express";
import { prismaDb } from "../connect/db";
import { errorHandler } from "../utils/error";
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomUUID } = require("crypto");

export const signUpController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password } = req.body;

  // Input validation
  if (!username || !email || !password) {
    return next(errorHandler(403, "All fields are required!"));
  }

  try {
    // Check if the user already exists by email
    const [existingUser] = (await prismaDb.$queryRaw`
      SELECT * FROM "User"
      WHERE email = ${email}
      LIMIT 1;
    `) as any;

    if (existingUser) {
      return next(errorHandler(400, "Email address already taken!"));
    }

    // Hash
    const hashedPassword = await bcryptjs.hashSync(password, 10);

    // Create new user
    const [newUser] = (await prismaDb.$queryRaw`
    INSERT INTO "User" (id, "createdAt", "updatedAt", username, email, password)
    VALUES (
      ${randomUUID()},
      NOW(),
      NOW(),
      ${username},
      ${email},
      ${hashedPassword}
    )
     RETURNING *;
  `) as any;

    res.status(201).json({
      message: "success",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (e) {
    console.log("Error in signup controller", e);
    next(errorHandler(500, "Server error, Please try again later!"));
  }
};

export const signInController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(errorHandler(403, "All fields are required!"));
  }

  try {
    const [validUser] = (await prismaDb.$queryRaw`
      SELECT * FROM "User"
      WHERE email = ${email}
      LIMIT 1;
    `) as any;

    if (!validUser) {
      return next(errorHandler(404, "Invalid email!"));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(404, "Incorrect password!"));
    }

    const { password: pass, ...rest } = validUser;
    const token = jwt.sign({ id: validUser.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ ...rest, token });
  } catch (e) {
    console.log("Error in signin controller", e);
    return next(errorHandler(500, "Server error, Please try again later!"));
  }
};

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req as any

  try {
    const [user] = (await prismaDb.$queryRaw`
      SELECT * FROM "User"
      WHERE id = ${userId}
      LIMIT 1;
    `) as any[];

    if (!user) {
      return next(errorHandler(404, "No user found"));
    }

    res.status(200).json(user);
  } catch (e) {
    console.log("Error in get user profile controller", e);
    return next(errorHandler(500, "Server error, Please try again later!"));
  }
};
