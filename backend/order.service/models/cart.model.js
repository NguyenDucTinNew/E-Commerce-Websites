import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  creatAt: {
    type: Date,
    default: Date.now,
  },
  listProduct: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem",
    },
  ],
});

CartSchema.plugin(mongoosePaginate);
const OrderModel = mongoose.model("Cart", CartSchema);
export default OrderModel;
