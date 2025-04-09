import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema(
  {
    nameProduct: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    idCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    idWarehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
    },
    desc: {
      type: String,
      default: "",
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

    productStatus: {
      type: String,
      enum: ["Sẵn Sàng", "Không sẵn sàng"],
      default: "Sẵn sàng",
    },
    is_deleted: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

productSchema.plugin(mongoosePaginate);
const product = mongoose.model("Product", productSchema);
export default product;
