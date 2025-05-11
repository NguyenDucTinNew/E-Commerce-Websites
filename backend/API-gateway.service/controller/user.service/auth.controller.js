import axios from "axios";
import config from "../../config.js";
import { HTTP_STATUS } from "../../common/http-status.common.js";
import * as dotenv from "dotenv";
import { isAuthenticated } from "../../../user.service/middlewares/authMiddleware.js";
import jwt from "jsonwebtoken";
import redisConfig from "../../../user.service/configs/init.redis.js"; // Đảm bảo đường dẫn đúng

dotenv.config();

// const redisClient = redisConfig.getRedis(); // Lấy client Redis
// const sessionid = redisConfig.get("mysession:sessionID"); // Đọc key từ Redis
export const authController = {
  // login for user
  login: async (req, res) => {
    const body = req.body;
    const result = await axios.post(
      `${process.env.USER_SERVICE_URL}/login`,
      body,
      config
    );
    if (!result)
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Đăng nhập thất bại",
        success: false,
      });

    return res.status(HTTP_STATUS.OK).json({
      message: "Đăng nhập thành công",
      sucess: true,
      data: result.data,
    });
  },
  //Register for customer
  register: async (req, res) => {
    try {
      const body = req.body;
      // 1. Gọi User Service - KHÔNG dùng .catch() ở đây
      let userResponse;
      try {
        userResponse = await axios.post(
          `${process.env.USER_SERVICE_URL}/register`,
          body,
          config
        );
      } catch (error) {
        // Nếu User Service trả về lỗi
        if (error.response) {
          return res.status(error.response.status).json({
            message: error.response.data.message || "Đăng ký thất bại",
            success: false,
            errors: error.response.data.errors,
          });
        }
        // Nếu không kết nối được với User Service
        return res.status(HTTP_STATUS.SERVICE_UNAVAILABLE).json({
          message: "Không thể kết nối với User Service",
          success: false,
        });
      }

      const userId = userResponse.data.user._id;
      let cartResponse;
      // 3. Tạo giỏ hàng
      try {
        cartResponse = await axios.post(
          `${process.env.ORDER_SERVICE_URL}/createCart/${userId}`,
          { userId },
          config
        );

        return res.status(HTTP_STATUS.CREATED).json({
          message: "Đăng ký thành công",
          success: true,
          user: userResponse.data.user,
          cart: cartResponse.data,
        });
      } catch (cartError) {
        // Rollback: Xóa user nếu tạo cart thất bại
        try {
          await axios.delete(
            `${process.env.USER_SERVICE_URL}/users/${userId}`,
            config
          );
        } catch (deleteError) {
          console.error("Lỗi khi xóa user rollback:", deleteError);
        }

        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          message: "Tạo giỏ hàng thất bại, đã hủy tài khoản",
          success: false,
        });
      }
    } catch (error) {
      console.error("Lỗi Gateway không xác định:", error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: "Lỗi hệ thống",
        success: false,
      });
    }
  },
  getSessionRole: async (req, res) => {
    const sessionrole = await axios.get(
      `${process.env.USER_SERVICE_URL}/getsessionrole`,
      config
    );
    console.log("sessionrole", sessionrole.data);
    if (!sessionrole) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Lấy session role thất bại",
        success: false,
      });
    }
  },
  getUserRoleFromRedis: async (req, res) => {
    const result = await axios.get(
      `${process.env.USER_SERVICE_URL}/getRoleFromRedis`,
      config
    );
    res.json({ result });
  },
  /*
  isAuthenticated: async (req, res, next) => {
    try {
      const result = await axios.get(
        `${process.env.USER_SERVICE_URL}/isAuthenticated`,
        config
      );
      console.log("isAuthenticated result:", result.data); // In ra kết quả để kiểm tra
      // Kiểm tra giá trị cụ thể từ result.data
      if (result.data === true) {
        next(); // Gọi next() để tiếp tục đến middleware tiếp theo
      } else {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          message: "Xác thực thất bại",
          success: false,
        });
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: "Có lỗi xảy ra",
        success: false,
      });
    }
  },
  */
  isAuthenticated: async (req, res, next) => {
    const sessionid = await axios.get(
      `${process.env.USER_SERVICE_URL}/getSessionID`,
      config
    );
    req.sessionID = sessionid.data.sessionID; // Lưu sessionID vào req.sessionID
    console.log("sessionID", req.sessionID); // In ra sessionID để kiểm tra
  },
};
