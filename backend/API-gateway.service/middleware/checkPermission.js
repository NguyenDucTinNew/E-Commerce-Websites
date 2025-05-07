import axios from "axios";
import { HTTP_STATUS } from "../common/http-status.common.js";
//import  redisconfig from "../configs/init.redis.js"; // Đảm bảo đường dẫn đúng
//checkrole middleware
const checkPremission = (requiredRole) => {
  return async (req, res, next) => {
    const userRole = await axios.get(
      `${process.env.USER_SERVICE_URL}/getRoleFromRedis`
    );
    if (userRole.data.role !== requiredRole) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        message: "Bạn không có quyền truy cập vào tài nguyên này",
        success: false,
      });
    }
    next();
  };
};
export default checkPremission;
