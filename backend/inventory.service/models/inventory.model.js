import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const inventorySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Tham chiếu đến model Product (trong ProductService)
      required: true,
      unique: true, // Đảm bảo mỗi sản phẩm chỉ có một bản ghi tồn kho
    },
    // Số lượng tồn kho của sản phẩm
    actualStock: {
      type: Number,
      required: true,
      min: 1,
    },
    reserStock: {
      type: Number,
      default: 0, // Số lượng đã đặt trước nhưng chưa giao hàng
    },
    avaliableStock: {
      type: Number,
    },
    // Các trường khác liên quan đến tồn kho (ví dụ: vị trí kho, lô hàng, v.v.)
    location: {
      type: String, // Ví dụ: "Kho A", "Chi nhánh Hà Nội"
    },
  },
  {
    timestamps: true,
  }
);

// Cập nhật lastUpdated trước khi lưu
inventorySchema.pre("save", function (next) {
  this.lastUpdated = Date.now();
  next();
});
inventorySchema.plugin(mongoosePaginate); // Thêm plugin phân trang nếu cần thiết
const Inventory = mongoose.model("Inventory", inventorySchema, "inventories");
export default Inventory;
