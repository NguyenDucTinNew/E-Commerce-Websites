import mongoose from "mongoose";

const warehouseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Tên của kho
  },
  location: {
    type: String,
    required: true, // Địa điểm của kho
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product", // Tham chiếu đến model Product
      },
      quantity: {
        type: Number,
        required: true,
        default: 0, // Số lượng sản phẩm trong kho
      },
      price: {
        type: Number,
        required: true, // Giá của sản phẩm
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now, // Thời gian tạo kho
  },
});

const Warehouse = mongoose.model("Warehouse", warehouseSchema, "warehouses");
export default Warehouse;
