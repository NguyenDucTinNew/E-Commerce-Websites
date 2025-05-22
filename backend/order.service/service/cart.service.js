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
    console.log(userId + " " + itemId + " " + quantity + " " + price);
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
    console.log("I'm here");
    if (existingItem) {
      // increase quantity and make a new price = quantity * price of this existing item
      existingItem.quantity += quantity; // Tăng số lượng

      existingItem.total = existingItem.quantity * price; // Tăng tổng giá trị
    } else {
      const total = quantity * price;
      cart.items.push({ itemId, quantity, price, total });
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

  findcart: async ({ userID }) => {
    return await Cart.findOne({ userId: userID });
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
  //update total during quantity change

  updateItemTotalwhenQuantityIncrease: async ({ cartId, itemId }) => {
    // Tìm giỏ hàng và mặt hàng cụ thể
    const cart = await Cart.findOne({ _id: cartId, "items.itemId": itemId });
    if (!cart) return null; // Kiểm tra nếu giỏ hàng không tồn tại

    const item = cart.items.find((item) => item.itemId === itemId);
    const newQuantity = item.quantity + 1; // Tăng số lượng lên 1
    const newTotal = item.price * newQuantity; // Tính toán tổng mới

    // Cập nhật giỏ hàng
    const updateCart = await Cart.findOneAndUpdate(
      { _id: cartId, "items.itemId": itemId },
      {
        $inc: {
          "items.$.quantity": 1,
        },
        $set: {
          "items.$.total": newTotal, // Cập nhật tổng mới
        },
      },
      { new: true }
    ).populate("items.itemId", "name price images");

    return updateCart; // Trả về giỏ hàng đã cập nhật
  },
  updateItemTupdateItemTotalwhenQuantityDecrease: async ({
    cartId,
    itemId,
  }) => {
    // Tìm giỏ hàng và mặt hàng cụ thể
    const cart = await Cart.findOne({ _id: cartId, "items.itemId": itemId });
    if (!cart) return null; // Kiểm tra nếu giỏ hàng không tồn tại

    const item = cart.items.find((i) => i.itemId === itemId);
    const newQuantity = item.quantity - 1; // Tăng số lượng lên 1
    const newTotal = item.price * newQuantity; // Tính toán tổng mới

    // Cập nhật giỏ hàng
    const updateCart = await Cart.findOneAndUpdate(
      { _id: cartId, "items.itemId": itemId },
      {
        $inc: {
          "items.$.quantity": -1,
        },
        $set: {
          "items.$.total": newTotal, // Cập nhật tổng mới
        },
      },
      { new: true }
    ).populate("items.itemId", "name price images");

    return updateCart; // Trả về giỏ hàng đã cập nhật
  },
  removeItemsFromCart: async (userId, items) => {
    let cart = await Cart.findOne({ userId: userId }); // Use findOne to get a single cart
    console.log(userId);
    console.log(cart);

    if (!cart) throw new Error("Cart not found");

    try {
      // Filter out items that are in the Items array
      cart.items = cart.items.filter((item) => !items.includes(item.itemId));
      await cart.save(); // Ensure you await the save operation

      return {
        message: "Xóa Sản Phẩm thành công",
        success: true,
      };
    } catch (error) {
      return {
        message: "Lỗi Xóa Sản Phẩm Thất Bại",
      };
    }
  },
};
export default CartService;
