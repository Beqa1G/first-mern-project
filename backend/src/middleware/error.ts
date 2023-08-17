import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";

export default function handleErrors(
  error: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
    logger.error(error)
    let errorMessage = "unknown error"
    if (error instanceof Error) errorMessage = error.message
    res.status(500).json({error: errorMessage})
}
