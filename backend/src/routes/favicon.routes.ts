import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.sendStatus(204);
});


export default router