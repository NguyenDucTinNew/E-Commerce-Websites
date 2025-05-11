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
  passport.authenticate("local", async (err, user, info) => {
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
      };

      req.session.user = sessionData;
      // Lưu thông tin vào Redis sau khi đăng nhập thành công
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
      console.log("sessionId", req.sessionID); // In ra session ID để kiểm tra

      // Thêm token vào header
      res.setHeader("Authorization", `Bearer ${token}`);
      return res.status(200).json({
        success: true,
        message: "Login success",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    });
  })(req, res, next);
});
// Đăng nhập người dùng

// Lấy thông tin profile người dùng
router.get(
  "/profile",
  // wrapRequestHandler(isAuthenticated), // Kiểm tra xác thực
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
router.get("/getRoleFromRedis/:sessionId", async (req, res) => {
  //get role from redis with key userRole
  const { sessionId } = req.params; // Lấy session ID từ request params
  const sessionDatastring = await redisConfig.getRedis().get(sessionId); // Hàm để lấy session từ Redis
  const sessionData = JSON.parse(sessionDatastring); // Chuyển đổi dữ liệu JSON thành đối tượng JavaScript
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
