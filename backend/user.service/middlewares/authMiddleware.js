import { HTTP_STATUS } from "../common/http-status.common.js";
import { userValidation } from "../validation/userValidation.js"; // Đảm bảo đường dẫn đúng đến file xác thực người dùng
import passport from "passport";

export const authMiddleware = async (req, res, next) => {
  const body = req.body;

  // Validate
  const { error } = userValidation.validate(body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((item) => item.message);
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: errors,
      success: false,
    });
  }

  next(); // Tiếp tục đến route handler
};

// Xuất isAuthenticated
export const isAuthenticated = passport.authenticate("jwt", { session: false });
