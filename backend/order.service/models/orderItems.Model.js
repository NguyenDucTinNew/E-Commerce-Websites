import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const OrderItemSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // Tham chiếu đến model Product
    required: true,
  }, // ID của mặt hàng
  quantity: {
    type: Number,
    required: true,
  }, // Số lượng
  price: {
    type: Number,
    required: true,
  }, // Giá của từng mặt hàng
});
OrderItemSchema.plugin(mongoosePaginate);
const OrderItemModel = mongoose.model("OrderItem", OrderItemSchema);
export default OrderItemModel;
