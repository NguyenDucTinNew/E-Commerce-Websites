import { orderService } from "../service/order.service.js";
import { HTTP_STATUS } from "../common/http-status.common.js";

export const orderController = {
  createCart: async (req, res) => {
  
    const body = req.body;
    const result = await orderService.createCart(body.userID);
    if (!result)
      return res.status(HTTP_STATUS.BAD_REQUEST).JSON({
        succes: false,
        message: "Tạo giỏ hàng thất bại",
      });
    else
      return res.status(HTTP_STATUS.OK).JSON({
        succes: true,
        message: "Tạo giỏ hàng thành công",
      });
  
    
  },
};

export default orderController;
