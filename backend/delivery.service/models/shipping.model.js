import mongoose from "mongoose";

const ShippingSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    shipperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shippingDate: {
      type: Date,
      default: Date.now,
    },
    deliveryDate: {
      type: Date,
    },
    status: {
      // Trạng thái vận chuyển (ví dụ: "pending", "shipping", "delivered")
      type: String,
      enum: ["pending", "shipping", "delivered", "failed"],
      default: "pending",
    },
    notes: {
      // Ghi chú về quá trình vận chuyển
      type: String,
    },
    // Thêm các trường khác tùy thuộc vào yêu cầu cụ thể của bạn
  },
  {
    timestamps: true,
  }
);

const Shipping = mongoose.model("Shipping", ShippingSchema);

export default Shipping;
