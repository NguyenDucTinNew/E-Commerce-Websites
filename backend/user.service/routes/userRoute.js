import express from "express";
import {
  register,
  getProfile,
  test,
  changepassword,
} from "../controllers/userController.js";
import {
  isAuthenticated,
  authMiddleware,
  checkrole,
  finduseraccount,
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
  },(err, user , infor)=>{
    if(err) return  next(err);
    if(!user) { return res.status(401).json({message: infor.message});
    }
    req.logIn(user, (err)=>{
      if(err) return next(err);
      return res.status(200).json({message: "Login success", user});
    });
  })
  (req, res, next);
}); // Xử lý đăng nhập
// Lấy thông tin profile người dùng
router.get(
  "/profile",
  wrapRequestHandler(isAuthenticated), // Kiểm tra xác thực
  wrapRequestHandler(getProfile) // Lấy thông tin profile
);
router.get(
  "/funcforadmin",
  wrapRequestHandler(checkrole("admin")), // Kiểm tra quyền truy cập
  wrapRequestHandler(test) // Kiểm tra xác thực
);
router.post(
  "/forgotPassword",
  wrapRequestHandler(finduseraccount), // Kiểm tra dữ liệu đầu vào
);
router.post(
  "/changepassword",
  wrapRequestHandler(changepassword) // Đổi mật khẩu
);
export default router;


