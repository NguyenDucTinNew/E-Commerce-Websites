import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    Images: [
      {
        url: {
          type: String,
        },
        public_id: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Cập nhật updatedAt trước khi lưu
categorySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

categorySchema.plugin(mongoosePaginate);
const Category = mongoose.model("Category", categorySchema, "categories");
export default Category;
