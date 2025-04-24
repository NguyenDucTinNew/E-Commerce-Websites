import express from "express";
import { register, getProfile } from "../controllers/userController.js";
import {
  isAuthenticated,
  authMiddleware,
} from "../middlewares/authMiddleware.js";
import { wrapRequestHandler } from "../utils/handle.util.js";
import passport from "../configs/passport.js"; // Đảm bảo đường dẫn đúng
const router = express.Router();
 
// Đăng ký người dùng
router.post(
  "/register",
  wrapRequestHandler(authMiddleware), // Kiểm tra dữ liệu đầu vào
  wrapRequestHandler(register) // Đăng ký người dùng
);

// Đăng nhập người dùng
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/api/v1/profile",
    failureRedirect: "/api/v1/login",
  })(req, res, next);
}); // Xử lý đăng nhập
// Lấy thông tin profile người dùng
router.get(
  "/profile",
  wrapRequestHandler(isAuthenticated), // Kiểm tra xác thực
  wrapRequestHandler(getProfile) // Lấy thông tin profile
);
export default router;
