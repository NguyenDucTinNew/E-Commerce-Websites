import Cart from "../models/cart.model.js";

export const CartService = {
  // 1. Tạo mới hoặc cập nhật giỏ hàng
  upsertCart: async ({ userId, items }) => {
    const filter = { userId };
    const update = {
      $set: {
        items: items.map((item) => ({
          itemId: item.itemId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    };
    const options = { upsert: true, new: true };

    return await Cart.findOneAndUpdate(filter, update, options).populate(
      "items.itemId",
      "name price images"
    ); // Populate thông tin sản phẩm
  },

  // 2. Thêm sản phẩm vào giỏ hàng
  addToCart: async ({ userId, itemId, quantity, price }) => {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      // Nếu chưa có giỏ hàng, tạo mới
      return await Cart.create({
        userId,
        items: [{ itemId, quantity, price }],
      });
    }

    // Kiểm tra sản phẩm đã tồn tại trong giỏ hàng chưa
    const existingItem = cart.items.find(
      (item) => item.itemId.toString() === itemId.toString()
    );

    if (existingItem) {
      existingItem.quantity += quantity; // Cập nhật số lượng nếu đã có
    } else {
      cart.items.push({ itemId, quantity, price }); // Thêm mới
    }

    await cart.save();
    return cart.populate("items.itemId", "name price images");
  },

  // 3. Xóa sản phẩm khỏi giỏ hàng
  removeFromCart: async ({ userId, itemId }) => {
    return await Cart.findOneAndUpdate(
      { userId },
      { $pull: { items: { itemId } } },
      { new: true }
    ).populate("items.itemId", "name price images");
  },

  // 4. Lấy giỏ hàng theo userId (có phân trang)
  getCartByUser: async (userId, page = 1, limit = 10) => {
    const options = {
      page,
      limit,
      populate: { path: "items.itemId", select: "name price images" },
    };

    return await Cart.paginate({ userId }, options);
  },

  // 5. Xóa toàn bộ giỏ hàng
  clearCart: async (userId) => {
    return await Cart.findOneAndDelete({ userId });
  },

  // 6. Cập nhật số lượng sản phẩm
  updateItemQuantity: async ({ userId, itemId, quantity }) => {
    const cart = await Cart.findOne({ userId });

    if (!cart) throw new Error("Cart not found");

    const item = cart.items.find(
      (item) => item.itemId.toString() === itemId.toString()
    );

    if (!item) throw new Error("Item not in cart");

    item.quantity = quantity;
    await cart.save();
    return cart.populate("items.itemId", "name price images");
  },
};

export default CartService;
