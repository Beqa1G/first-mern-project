import jwt, { JwtPayload } from "jsonwebtoken";
import UserModel from "../models/user.model";
import createHttpError from "http-errors";
import env from "../utils/validatedotenv";
import { Request, Response, NextFunction } from "express";



export async function protectMiddleWare(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as JwtPayload
      console.log("Decoded JWT Payload:", decoded);
      req.user = await UserModel.findById(decoded.userId).select("-password");

      next();
    } catch (error) {
      next(createHttpError(401, 'Not Authorized, invalid token'));
    }
  } else {
    next(createHttpError(401, 'Not Authorized, no token'));
  }
}
