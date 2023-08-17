import logger from "../utils/logger";
import createHttpError from "http-errors";
import UserModel from "../models/user.model";
import generateToken from "../utils/generateToken";
import { NextFunction, Request, Response } from "express";
import { createUserInput,} from "../schemas/user.schema";
import { registerUser } from "../services/user.service";
import { omit } from "lodash";
import { createLoginInput } from "../schemas/login.schema";
import { z } from "zod";
import linkModel from "../models/link.model";


export async function getUserByUsername(req:Request, res:Response, next:NextFunction)  {
   try {
    const username = req.params.username
    const user = await UserModel.findOne({username}).exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const links = await linkModel.find({userId: user._id});

    const sanitizedUser = omit(user.toObject(), ["password"]);

    res.status(200).json({user:sanitizedUser, links})
   } catch (error) {
    next(error)
   }
}


export async function registerUserHandler(
  // eslint-disable-next-line @typescript-eslint/ban-types
  req: Request<{}, {}, createUserInput["body"]>,
  res: Response,
  next: NextFunction
) {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword

  try {

    
    console.log("Received request with data:", req.body);
    const existingUsername = await UserModel.findOne({
      username: username,
    }).exec();

    if (existingUsername) {
      throw createHttpError(409, "Username already taken");
    }

    const existingEmail = await UserModel.findOne({ email: email }).exec();

    if (existingEmail) {
      throw createHttpError(409, "User with this email already exists");
    }

    if (password.length < 6) {
      throw createHttpError(400, "Password has to be 6 characters long");
    }

    if(password !== confirmPassword) {
      throw createHttpError(400, "Passwords do not match")
    }

    const user = await registerUser(req.body);

    /* generateToken(res, user._id) */
    return res.send(omit(user.toJSON(), "password"));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
      logger.error(error);
      next(error);
  }
}


export async function loginUserHandler(
  // eslint-disable-next-line @typescript-eslint/ban-types
  req: Request<{}, {}, createLoginInput["body"]>,
  res: Response,
  next: NextFunction
) {
  const { username, password } = req.body;
  const errorMessage: number = 401;

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      throw createHttpError(errorMessage, "invalid credentials");
    }

    const isValid = await user.comparePassword(password);

    if (!isValid) {
      throw createHttpError(errorMessage, "invalid credentials");
    }

    generateToken(res, user._id);
    const sanitizedUser = omit(user.toObject(), [
      "password",
      "createdAt",
      "updatedAt",
    ]);
    res.status(201).json(sanitizedUser);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      next(createHttpError(400, error.issues[0].message));
    } else {
      logger.error(error);
      next(error);
    }
  }
}

export async function logout(req: Request, res: Response) {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204); //no content
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "strict",
  });
  res.status(201).json({ message: "User logged out" });
}

export async function getUser(req: Request, res: Response) {
  const user = omit(req.user.toJSON(), ["password", "createdAt", "updatedAt"]);

  res.status(200).json(user);
}

export async function updateUser(req: Request, res: Response, next: NextFunction) {

try {
  const user = await UserModel.findById(req.user._id);

  if (!user) {
    throw createHttpError(404, "User not  found");
  }

  user.username = req.body.username || user.username;
  user.email = req.body.email || user.email;

  if (req.body.password) {
    user.password = req.body.password;
  }

  if(user.password.length < 6) {
    throw createHttpError(400, "password needs to be 6 characters long")
  }
  const updatedUser = await user.save();

  res.status(200).json({
    _id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
  });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
} catch (error:any) {
  logger.error(error);
  next(error);
}

  
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const userId = req.user._id;

    const deletedUser = await UserModel.findByIdAndDelete(userId);

    await linkModel.deleteMany({ userId });

    if (!deletedUser) {
      throw createHttpError(404, "User not found");
    }

    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "strict",
    });
    res.status(200).json({ message: "User deleted successfully" });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error(error);
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
}
