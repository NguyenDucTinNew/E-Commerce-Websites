import express from "express";
import { register, login, getProfile } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { wrapRequestHandler } from "../utils/handle.util.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import User  from "../models/userModel.js";
import jwt from "jsonwebtoken";
const router = express.Router();

// Đăng ký người dùng
router.post(
  "/register",
  wrapRequestHandler(authMiddleware),
  wrapRequestHandler(register)
);

// Đăng nhập người dùng
router.post("/login", wrapRequestHandler(login));

// Lấy thông tin profile người dùng
router.get(
  "/profile",
  wrapRequestHandler(isAuthenticated),
  wrapRequestHandler(getProfile)
);

export default router;
