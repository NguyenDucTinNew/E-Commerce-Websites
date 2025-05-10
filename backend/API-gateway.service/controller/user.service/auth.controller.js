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
    const body = req.body;
    const newaccount = await axios.post(
      `${process.env.USER_SERVICE_URL}/register`,
      body,
      config
    );
    console.log("Response data:", newaccount.data);
    console.log("Response headers:", newaccount.headers);
    if (!newaccount)
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Đăng ký thất bại!",
        success: false,
      });
    console.log(newaccount.data.user);
    const userid = newaccount.data.user._id;
    console.log("undefine ne", userid);
    const newcart = await axios.post(
      `${process.env.ORDER_SERVICE_URL}/createCart/${userid}`,
      body,
      config
    );
    if (newcart) {
      console.log("Tao gio hang thanh cong");
    }
    return res.status(HTTP_STATUS.CREATED).json({
      message: "Đăng ký thành công",
      success: true,
      data: newcart.data,
    });
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
