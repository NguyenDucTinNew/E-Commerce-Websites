import mongoose from "mongoose";
import _ from "mongoose-paginate-v2";
import mongoosePaginate from "mongoose-paginate-v2";

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      require: true,
    },
    items: [
      {
        itemId: {
          type: String,
          require: true,
        },
        quantity: {
          type: Number,
        },
        price: {
          type: Number,
        },
        total: {
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
