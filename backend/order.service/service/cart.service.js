import Cart from "../models/cart.model.js";
import mongoose from "mongoose";
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
    // convert userId to ObjectId
    const cart = await Cart.findOne({ userId: userId });
    if (!cart) {
      const Toltal = quantity * price;
      // Nếu chưa có giỏ hàng, tạo mới
      return await Cart.create({
        userId: userId,
        items: [{ itemId, quantity, price, total: Toltal }],
      });
    }
    // Kiểm tra sản phẩm đã tồn tại trong giỏ hàng chưa
    const existingItem = cart.items.find((item) => item.itemId === itemId);
    if (existingItem) {
      // increase quantity and make a new price = quantity * price of this existing item
      existingItem.quantity += quantity; // Tăng số lượng
      existingItem.total += quantity * price; // Tăng tổng giá trị
    } else {
      const total = quantity * price;
      cart.items.push({ itemId, quantity, price, total }); // Thêm mới
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
