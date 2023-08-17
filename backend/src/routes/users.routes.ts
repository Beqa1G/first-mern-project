import express from "express";
import {
  deleteUser,
  getUser,
  getUserByUsername,
  loginUserHandler,
  logout,
  registerUserHandler,
  updateUser,
} from "../controllers/users.controller";
import { protectMiddleWare } from "../middleware/authMiddleware";
import validateResource from "../middleware/validateResource";
import { createLoginSchema } from "../schemas/login.schema";
import { createUserSchema } from "../schemas/user.schema";


const router = express.Router();



router.get("/profile", protectMiddleWare, getUser);

router.put("/profile", protectMiddleWare, updateUser);

router.delete("/profile", protectMiddleWare, deleteUser)

router.post("/signup", validateResource(createUserSchema), registerUserHandler);

router.post("/login", validateResource(createLoginSchema), loginUserHandler);

router.post("/logout", logout);

router.get("/:username", getUserByUsername);

export default router;
