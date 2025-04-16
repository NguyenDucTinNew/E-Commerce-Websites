import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const categorySchema = new mongoose.Schema(
  {
    nameCategory: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
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
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

categorySchema.plugin(mongoosePaginate);

const category = mongoose.model("Category", categorySchema, "Category");
export default category;
