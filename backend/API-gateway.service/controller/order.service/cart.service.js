import axios from "axios";
import config from "../../config.js";
import * as dotenv from "dotenv";
import { HTTP_STATUS } from "../../common/http-status.common.js";
import { json } from "express";

dotenv.config();
export const cartController = {
  addCart: async (req, res) => {
    try {
      const { userId } = req.params;
      const body = req.body;
      let resCart;
      try {
        resCart = await axios.post(
          `${config.ORDER_SERVICE_URL}/create/${userId}`,
          body
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
};

export default cartController;
