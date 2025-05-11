import axios from "axios";
import { HTTP_STATUS } from "../common/http-status.common.js";
import jwt from "jsonwebtoken";
import { getSessionIDfromToken } from "../common/getSessionIDfromToken.js";
//import  redisconfig from "../configs/init.redis.js"; // Đảm bảo đường dẫn đúng
//checkrole middleware
const checkPermission = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const sessionId = getSessionIDfromToken(req, res); // Gọi hàm để lấy sessionId

      if (!sessionId) {
        return res
          .status(401)
          .json({ message: "Invalid token: sessionId missing" });
      }

      // 3. Lấy role từ Redis thông qua user service
      const response = await axios.get(
        `${process.env.USER_SERVICE_URL}/getRoleFromRedis/${sessionId}`
      );

      const userRole = response.data.role;
      console.log("User role:", userRole);

      // 4. Kiểm tra quyền
      if (userRole !== requiredRole) {
        return res.status(403).json({
          message: "Bạn không có quyền truy cập vào tài nguyên này",
          success: false,
        });
      }
      console.log("Permission granted");
      // 5. Nếu có quyền, tiếp tục middleware tiếp theo
      next();
    } catch (error) {
      console.error("Permission check error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
};
export default checkPermission;
