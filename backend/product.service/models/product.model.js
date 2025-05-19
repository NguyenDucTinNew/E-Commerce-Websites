import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0, // Giá không được âm
    },
    stock: {
      type: Number,
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // Tham chiếu đến model Category
      required: true,
    },
    images: {
      type: [String], // Danh sách URL hình ảnh
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Cập nhật updatedAt trước khi lưu
productSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

productSchema.plugin(mongoosePaginate);
const Product = mongoose.model("Product", productSchema, "products");
export default Product;
