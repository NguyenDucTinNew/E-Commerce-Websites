import { HTTP_STATUS } from "../common/http-status.common.js";


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
