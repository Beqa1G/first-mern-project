import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";
import {
  createLinks,
  deleteLink,
  getLink,
  updateLink,
} from "../services/links.service";
import {
  createLinkInput,
  deleteLinkInput,
  updateLinkInput,
} from "../schemas/link.schema";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { assertIsDefined } from "../utils/assertIsDefined";
import linkModel from "../models/link.model";

export async function getLinksHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authenticateduserId = req.user._id;

  try {

    
    const links = await linkModel.find({userId: authenticateduserId}).exec();
    res.status(200).json(links);
  } catch (error) {
    next(error);
  }
}

export async function getSingleLinkHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const linkId = req.params.linkId;
  const authenticateduserId = req.user._id;

  try {
    if (!mongoose.isValidObjectId(linkId)) {
      throw createHttpError(400, "invalid link id");
    }

    const link = await getLink(linkId);

    if (!link) {
      /* res.status(404).json({error: "link not found"}) */
      throw createHttpError(404, "link not found");
    }

    if (!link.userId.equals(authenticateduserId)) {
      throw createHttpError(401, "You cannot access this link");
  }
    res.status(200).json(link);
  } catch (error) {
    next(error);
  }
}

export async function createLinksHandler(
  // eslint-disable-next-line @typescript-eslint/ban-types
  req: Request<{}, {}, createLinkInput["body"]>,
  res: Response
) {

  /*   const header = req.body.header; */
  /* const Url = req.body.Url */
  const body = req.body;
  const authenticateduserId = req.user._id;

  

  try {
    /*     const newLink = await createLinks({
      header: header,
      Url: Url,
    }); */
    assertIsDefined(authenticateduserId)

    const newLink = await createLinks({
      ...body,
      userId: authenticateduserId,
    });
    res.status(201).json(newLink);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error(error);
    return res.status(409).send(error.message);
  }
}

export async function updateLinksHandler(
  req: Request<updateLinkInput["params"]>,
  res: Response,
  next: NextFunction
) {
  const linkId = req.params.linkId;
  const authenticateduserId = req.user._id;


  const newLink = req.body;

  try {
    if (!mongoose.isValidObjectId(linkId)) {
      throw createHttpError(400, "invalid link id");
    }

    const link = await getLink(linkId);

    if (!link) {
      /* res.status(404).json({error: "link not found"}) */
      throw createHttpError(404, "link not found");
    }

    if (!link.userId.equals(authenticateduserId)) {
      throw createHttpError(401, "You cannot access this link");
  }

    const updatedLink = await updateLink(linkId, newLink, { new: true });

    res.send(updatedLink);
  } catch (error) {
    next(error);
  }
}

export async function deleteLinkHandler(
  req: Request<deleteLinkInput["params"]>,
  res: Response,
  next: NextFunction
) {
  const linkId = req.params.linkId;
  const authenticateduserId = req.user._id;

  try {
    if (!mongoose.isValidObjectId(linkId)) {
      throw createHttpError(400, "invalid link id");
    }
    const link = await getLink(linkId);

    if (!link) {
      /* res.status(404).json({error: "link not found"}) */
      throw createHttpError(404, "link not found");
    }

    if (!link.userId.equals(authenticateduserId)) {
      throw createHttpError(401, "You cannot access this link");
  }

    await deleteLink(linkId);

    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
}
