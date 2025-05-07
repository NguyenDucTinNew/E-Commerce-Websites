import product from "../models/product.model.js";
import { HTTP_STATUS } from "../common/http-status.common.js";
import Category from "../models/category.model.js";

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
    const deletedProduct = await product.findByIdAndDelete(idProduct);
    if (!deletedProduct) return null;
    return deletedProduct;
  },
};

export default productService;
