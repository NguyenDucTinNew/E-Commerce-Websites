import express from "express";
import {
  register,
  getProfile,
  changePassword,
  getLisUser,
  getuserbyId,
  deleteUser,
  updateUser,
} from "../controllers/userController.js";
import {
  isAuthenticated,
  authMiddleware,
  finduseraccount,
} from "../middlewares/authMiddleware.js";
import { wrapRequestHandler } from "../utils/handle.util.js";
import passport from "../configs/passport.js"; // Đảm bảo đường dẫn đúng
import redisConfig from "../configs/init.redis.js"; // Đảm bảo đường dẫn đúng
import jwt from "jsonwebtoken"; // Đảm bảo đường dẫn đúng
//const jwt = require("jsonwebtoken");
const router = express.Router();

// Đăng ký người dùng
router.post(
  "/register",
  wrapRequestHandler(authMiddleware), // Kiểm tra dữ liệu đầu vào
  wrapRequestHandler(register) // Đăng ký người dùng
);
// user.routes.js
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: info.message,
      });
    }

    req.logIn(user, async (err) => {
      if (err) return next(err);

      // Lưu session vào Redis
      const sessionData = {
        userId: user.id,
        role: user.role,
        // Các thông tin khác cần thiết
      };

      await redisConfig.getRedis().set(
        req.sessionID,
        JSON.stringify(sessionData),
        "EX",
        86400 // TTL 1 ngày
      );

      // Tạo JWT chứa sessionID
      const token = jwt.sign(
        { sessionId: req.sessionID },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      console.log(req.session.id); // In ra token để kiểm tra
      // Thêm token vào header
      res.setHeader("Authorization", `Bearer ${token}`);
      console.log("Token:", token); // In ra token để kiểm tra
      return res.status(200).json({
        success: true,
        message: "Login success",
        token, // Trả về token cho client
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          // Chỉ trả về thông tin cần thiết
        },
      });
    });
  })(req, res, next);
});
// Đăng nhập người dùng

// Lấy thông tin profile người dùng
router.get(
  "/profile",
  wrapRequestHandler(isAuthenticated), // Kiểm tra xác thực
  wrapRequestHandler(getProfile) // Lấy thông tin profile
);
/*
router.get(
  "/funcforadmin",
  wrapRequestHandler(checkrole("admin")), // Kiểm tra quyền truy cập
  wrapRequestHandler(test) // Kiểm tra xác thực
);
*/
router.post(
  "/forgotPassword",
  wrapRequestHandler(finduseraccount) // Kiểm tra dữ liệu đầu vào
);
// change password
router.post(
  "/changepassword",
  wrapRequestHandler(changePassword) // Đổi mật khẩu
);
//get all user
router.get(
  "/getallusers",
  wrapRequestHandler(isAuthenticated), // Kiểm tra xác thực
  wrapRequestHandler(getLisUser) // Lấy tất cả người dùng
);
// Đăng xuất người dùng
router.get(
  "/getuserbyid/:userid",
  wrapRequestHandler(isAuthenticated), // Kiểm tra xác thực
  wrapRequestHandler(getuserbyId)
);
router.delete(
  "/deleteuser/:userid",
  wrapRequestHandler(isAuthenticated), // Kiểm tra xác thực
  wrapRequestHandler(deleteUser)
);
router.put(
  "/updateuser/:userid",
  wrapRequestHandler(isAuthenticated), // Kiểm tra xác thực
  wrapRequestHandler(authMiddleware), // Kiểm tra dữ liệu đầu vào
  wrapRequestHandler(updateUser) // Cập nhật thông tin người dùng
);
router.get("/getRoleFromRedis", async (req, res) => {
  //get role from redis with key userRole
  const userRole = "userRole"; // Key để lưu trữ role trong Redis
  const sessionData = await redisConfig.getRedis().get(userRole); // Hàm để lấy session từ Redis
  if (!sessionData) {
    return res.status(401).json({ message: "Invalid session" });
  } else {
    res.json({ role: sessionData.role }); // Trả lại thông tin role
  }
});
router.get("/getSessionID", (req, res) => {
  console.log("Request sessionID:", req.sessionID);
  const sessionId = req.sessionID; // Lấy session ID từ request
  console.log("sessionId", sessionId); // In ra session ID để kiểm tra
  res.json({ sessionId }); // Trả về session ID cho client
});
router.get("/isAuthenticated", async (req, res) => {
  const sessionId = req.sessionID; // Lấy session ID từ request
  const sessionData = await redisConfig.getRedis().get(sessionId);

  if (sessionData) {
    return res.status(200).json({ success: true }); // Trả về true nếu có
  } else {
    return res.status(404).json({ success: false }); // Trả về false nếu không
  }
});
router.get("/userbyid/:userid", (req, res) => {
  const { userid } = req.params;
  console.log("userid", userid); // In ra userid để kiểm tra
  res.json({ userid }); // Trả về userid cho client
});
export default router;
