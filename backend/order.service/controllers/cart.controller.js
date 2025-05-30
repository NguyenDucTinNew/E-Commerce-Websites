import CartService from "../service/cart.service.js";
import { HTTP_STATUS } from "../common/http-status.common.js";
import Cart from "../models/cart.model.js";
export const cartController = {
  getCart: async (req, res) => {
    try {
      const { userId } = req.params;
      const { page, limit } = req.query;
      const cart = await CartService.getCartByUser(userId, page, limit);
      res.json(cart);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // 2. Thêm sản phẩm vào giỏ hàng
  addItem: async (req, res) => {
    try {
      const userId = req.params.userId;
      console.log("userId", userId);
      console.log("req.body", req.body);
      const { items } = req.body;
      const { itemId, quantity, price } = items[0];
      const cart = await CartService.addToCart({
        userId,
        itemId,
        quantity,
        price,
      });
      res.status(201).json({
        success: true,
        message: "Thêm sản phẩm vào giỏ hàng thành công",
        data: cart,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Thêm sản phẩm thất bại",
        error: error.message,
      });
    }
  },

  // remove a item from cart
  removeItem: async (req, res) => {
    try {
      const { userId, itemId } = req.params;
      const cart = await CartService.removeFromCart({ userId, itemId });
      res.json(cart);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // 4. Cập nhật số lượng sản phẩm
  updateQuantity: async (req, res) => {
    try {
      const { userId, itemId } = req.params;
      const { quantity } = req.body;
      const cart = await CartService.updateItemQuantity({
        userId,
        itemId,
        quantity,
      });
      res.json(cart);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // 5. Xóa toàn bộ giỏ hàng
  clearCart: async (req, res) => {
    try {
      const { userId } = req.params;
      await CartService.clearCart(userId);
      res.json({ message: "Cart cleared successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  findCart: async (req, res) => {
    try {
      const { userId } = req.params;
      const resFindCart = await CartService.findcart(userId);
      if (resFindCart) {
        return res.status(HTTP_STATUS.OK).json({
          message: "Found Cart",
          success: true,
        });
      }
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Cart not Found",
        success: false,
      });
    } catch (error) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: error.message,
        success: false,
      });
    }
  },

  // transfer items from cart to order
  removeItemsFromCart: async (req, res) => {
    try {
      let userId = req.params.userId;
      let items = req.body.items;
      try {
        const resCartRemove = await CartService.removeItemsFromCart(
          userId,
          items
        );
        if (resCartRemove)
          return res.status(HTTP_STATUS.OK).json({
            message: "Xoa San Pham Thanh Cong",
            success: true,
          });
      } catch (resCarerror) {
        console.log("chay that bai");
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          message: resCarerror.message || "Lấy sản phẩm thất bại",
          success: false,
        });
      }
    } catch (error) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: error.message,
        success: false,
      });
    }
  },
};
export default cartController;
