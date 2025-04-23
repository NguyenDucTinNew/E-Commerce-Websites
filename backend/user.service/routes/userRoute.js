import express from "express";
import { register, login, getProfile } from "../controllers/userController.js";
import {
  isAuthenticated,
  authMiddleware,
} from "../middlewares/authMiddleware.js";
import { wrapRequestHandler } from "../utils/handle.util.js";
import passport from "passport";
const router = express.Router();

// Đăng ký người dùng
router.post(
  "/register",
  wrapRequestHandler(authMiddleware), // Kiểm tra dữ liệu đầu vào
  wrapRequestHandler(register) // Đăng ký người dùng
);

// Đăng nhập người dùng
router.post(
  "/login",
   passport.authenticate("local", {
    successRedirect: "/api/v1/profile", // Chuyển hướng đến trang profile nếu đăng nhập thành công
    failureRedirect: "/api/v1/login", // Chuyển hướng đến trang đăng nhập nếu thất bại
    failureFlash: true, // Sử dụng flash message để thông báo lỗ
  })
); // Xử lý đăng nhập
// Lấy thông tin profile người dùng
router.get(
  "/profile",
  wrapRequestHandler(isAuthenticated), // Kiểm tra xác thực
  wrapRequestHandler(getProfile) // Lấy thông tin profile
);
export default router;
