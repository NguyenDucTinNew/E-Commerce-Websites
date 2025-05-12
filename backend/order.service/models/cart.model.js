import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    items: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Tham chiếu đến model Product
        },
        quantity: {
          type: Number,
        },
        price: {
          type: Number,
        },
      },
    ],
  },
  {
    timestamps: true, // Mongoose sẽ tự động thêm createdAt và updatedAt
  }
);

CartSchema.plugin(mongoosePaginate);
const Cart = mongoose.model("Cart", CartSchema);
export default Cart;
