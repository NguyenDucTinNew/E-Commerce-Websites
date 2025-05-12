import product from "../models/product.model.js";
import { HTTP_STATUS } from "../common/http-status.common.js";
import Category from "../models/category.model.js";
import mongoose from "mongoose";

const productService = {
  createProduct: async (body) => {
    const newProduct = await product.create(body);
    if (!newProduct) return null;
    return newProduct;
  },

  getProductById: async (idProduct) => {
    const productDetail = await product
      .findById(idProduct)
      .populate("categoryId");
    if (!productDetail) return null;
    return productDetail;
  },

  fetchListProduct: async () => {
    const listProduct = await product.find({}).populate("categoryId");
    if (!listProduct) return null;
    return listProduct;
  },

  updateProduct: async (idProduct, body) => {
    const updatedProduct = await product.findByIdAndUpdate(idProduct, body, {
      new: true,
    });
    if (!updatedProduct) return null;
    return updatedProduct;
  },

deleteProduct: async (idProduct) => {
  try {
    const objectId = new mongoose.Types.ObjectId(idProduct); // Chuyển đổi
    const result = await product.findByIdAndDelete(objectId);
    return result;
  } catch (error) {
    console.error("Lỗi trong productService.deleteProduct:", error);
    throw error; // Ném lỗi để controller xử lý
  }
},
  getproductbyname: async (name) => {
    const productDetail = await product.find({ name: { $regex: name } });
    if (!productDetail) return null;
    return productDetail;
  },
  getproductbycategory: async (categoryId) => {
    const productDetail = await product.find({ categoryId: categoryId });
    if (!productDetail) return null;
    return productDetail;
  },
};
export default productService;
