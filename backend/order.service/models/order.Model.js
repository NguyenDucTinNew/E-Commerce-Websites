import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  }, // ID của đơn hàng
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Tham chiếu đến model Category
    required: true,
  }, // ID của người dùng
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem",
      required: true,
    },
  ], // Tham chiếu đến các mặt hàng
  totalAmount: {
    type: Number,
    required: true,
  }, // Tổng số tiền
  status: {
    type: String,
    enum: ["pending", "completed", "canceled"],
    default: "pending",
  }, // Trạng thái
  createdAt: {
    type: Date,
    default: Date.now,
  }, // Ngày tạo
  updatedAt: {
    type: Date,
    default: Date.now,
  }, // Ngày cập nhật
});
OrderSchema.pre("save", function (next) {
  this.updatedAt = Date.now(); // Cập nhật ngày cập nhật trước khi lưu
  next();
});
OrderSchema.plugin(mongoosePaginate);
const OrderModel = mongoose.model("Order", OrderSchema);
export default OrderModel;
