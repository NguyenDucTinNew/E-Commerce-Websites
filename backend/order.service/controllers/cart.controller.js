import CartService from "../service/cart.service.js";

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
      const { userId } = req.params;
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

  // 3. Xóa sản phẩm khỏi giỏ hàng
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
};
export default cartController;
