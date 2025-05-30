import axios from "axios";
import config from "../../config.js";
import * as dotenv from "dotenv";
import { HTTP_STATUS } from "../../common/http-status.common.js";
import { json } from "express";
import redisConfig from "../../redisseting/init.redis.js";
dotenv.config();
export const CartController = {
  addCart: async (req, res) => {
    try {
      const { userId } = req.params;
      const body = req.body;
      let resCart;
      try {
        resCart = await axios.post(
          `${process.env.ORDER_SERVICE_URL}/create/${userId}`,
          body,
          config
        );
        res.status(HTTP_STATUS.CREATED).json({
          success: true,
          message: resCart.data.message,
          data: resCart.data.data,
        });
      } catch (error) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: resCart.data.message,
          error: resCart.data.error,
        });
      }
    } catch (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Lỗi khi tạo giỏ hàng",
        error: error.message,
      });
    }
  },
  deteleItemInCart: async (req, res) => {
    try {
      const { userId, itemId } = req.params;
      const resCart = await axios.delete(
        `${process.env.ORDER_SERVICE_URL}/${userId}/items/${itemId}`,
        config
      );

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: resCart.data.message,
        data: resCart.data.data,
      });
    } catch (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Lỗi khi xóa sản phẩm trong giỏ hàng",
        error: error.message,
      });
    }
  },
  transferItems: async (req, res) => {
    try {
      let userId = await redisConfig.getRedis().get("userId");
      try {
        const CartExisting = await axios.get(
          `${process.env.ORDER_SERVICE_URL}/findCart/${userId}`
        );
      } catch (error) {
        return {
          message: "Cart Not Found",
          success: false,
        };
      }

      const { items } = req.body;

      try {
        const resRemoveER = await axios.post(
          `${process.env.ORDER_SERVICE_URL}/transferItems/${userId}`,
          { items },
          config
        );
        if (resRemoveER)
          return res.status(HTTP_STATUS.OK).json({
            message: resRemoveER.data.message,
            success: true,
          });
      } catch (resRemoveeror) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          message: error.message || "Lỗi Hệ Thống",
        });
      }
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: "Lỗi Server",
        success: false,
      });
    }
  },
};

export default CartController;
