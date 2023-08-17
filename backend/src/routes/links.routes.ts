import express from "express"
import validateResource from "../middleware/validateResource";
import { createLinksHandler, deleteLinkHandler, getLinksHandler, getSingleLinkHandler, updateLinksHandler } from "../controllers/links.controller";
import { createLinkSchema, deleteLinkSchema, updateLinkSchema } from "../schemas/link.schema";

const router = express.Router()

router.get("/", getLinksHandler);

router.get("/:linkId", getSingleLinkHandler)

router.post("/", validateResource(createLinkSchema), createLinksHandler)

router.patch("/:linkId", validateResource(updateLinkSchema), updateLinksHandler)

router.delete("/:linkId", validateResource(deleteLinkSchema), deleteLinkHandler)

export default router