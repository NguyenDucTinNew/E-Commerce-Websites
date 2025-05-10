import orderService from "../service/order.service";

export const orderController = {
  createCart: async (req, res) => {
    const userid = req.userid;
    const result = await orderService.createCart(userid);

    if (!result)
      return {
        succes: true,
        message: " Tạo giỏ hàng thành công",
      };
    else
      return {
        succes: false,
        message: "Tạo giỏ hàng thaasrt bại",
      };
  },
};

export default orderController;
