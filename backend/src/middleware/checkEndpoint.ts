import { NextFunction, Request, Response } from "express";

export default function checkEndpoint(
  req: Request,
  res: Response,
  next: NextFunction
) {
  next(Error("endpoint not found"));
}
