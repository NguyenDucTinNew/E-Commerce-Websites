import axios from "axios";
import config from "../../config.js";
import * as dotenv from "dotenv";
import { HTTP_STATUS } from "../../common/http-status.common.js";
import { json } from "express";

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
        `${process.env.ORDER_SERVICE_URL}/delete/${userId}/items/${itemId}`,
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
        message: "Lỗi khi xóa sản phẩm trong giỏ hàng",
        error: error.message,
      });
    }
  },
};

export default CartController;
