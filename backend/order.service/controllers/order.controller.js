import { orderService } from "../service/order.service.js";
import { HTTP_STATUS } from "../common/http-status.common.js";

export const orderController = {
  createCart: async (req, res) => {
    const userid = req.params.userId;
    const result = await orderService.createCart(userid);
    if (!result)
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        succes: false,
        message: "Tạo giỏ hàng thất bại",
      });
    else console.log("tới đây rùi");
    return res.status(HTTP_STATUS.CREATED).json({
      succes: true,
      message: "Tạo giỏ hàng thành công",
    });
  },
};

export default orderController;
