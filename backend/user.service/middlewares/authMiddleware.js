import { HTTP_STATUS } from "../common/http-status.common.js";
import { userValidation } from "../validation/userValidation.js"; // Đảm bảo đường dẫn đúng
import User from "../models/userModel.js"; // Đảm bảo đường dẫn đúng

// Middleware kiem tra nguoi dung
export const authMiddleware = async (req, res, next) => {
  // Thêm vào đầu middleware
  console.log("Request body:", req.body);
  console.log("Headers:", req.headers);
  const body = req.body;
  const username = req.body.username;
  const email = req.body.email;
  try {
    // Validate
    const { error } = userValidation.validate(body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((item) => item.message);
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: errors,
        success: false,
      });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        errors: "Validate Failed",
        success: false,
        message: "Username already exists",
      });
    }

    // Kiểm tra sự tồn tại của email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        errors: "Validate Failed",
        message: "Email already exists",
        success: false,
      });
    }
    next();
  } catch (error) {
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ message: "Lỗi Hệ Thống", success: false });
  }
  // Tiếp tục đến route handler
};

export const finduseraccount = async (req, res, next) => {
  const username = req.body.username;
  const user = await User.findOne({ username });
  if (user) next(); // Tiếp tục đến route handler
  else
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: "Username not found",
      success: false,
    });
};
// Middleware kiểm tra xác thực *** Check session id được lưu trong cookie

export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next(); // Người dùng đã xác thực, tiếp tục đến route handler
  } else {
    console.log("User not authenticated"); // Ghi log nếu người dùng không xác thực
  }
  return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" });
};

export const checkrole = (role) => {
  return (req, res, next) => {
    if (req.user.role === role) {
      return next();
    }
    return res.status(HTTP_STATUS.FORBIDDEN).json({ message: "Forbidden" });
  };
};
