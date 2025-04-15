import express from "express";
import { register, login, getProfile } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { wrapRequestHandler } from "../utils/handle.util.js";

const router = express.Router();

// Đăng ký người dùng
router.post("/register", wrapRequestHandler(register));

// Đăng nhập người dùng
router.post("/login", wrapRequestHandler(login));

// Lấy thông tin profile người dùng
router.get(
  "/profile",
  wrapRequestHandler(isAuthenticated),
  wrapRequestHandler(getProfile)
);

export default router;
