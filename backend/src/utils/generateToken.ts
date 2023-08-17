import { Response } from "express";
import jwt from "jsonwebtoken";
import env from "./validatedotenv";

export default function generateToken(res: Response, userId: string) {
  const token = jwt.sign({ userId }, env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 1 * 24 * 60 * 60 * 1000,
  });
}
