import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product",
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
      price: {
        type: Number,
        required: true, // Giá của sản phẩm
      },
    },
  ],
  total: {
    type: Number,
    default: 0, // Tổng giá trị của giỏ hàng
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
cartSchema.plugin(mongoosePaginate);
const cart = mongoose.model("Cart", cartSchema, 'cart');
export default cart;
