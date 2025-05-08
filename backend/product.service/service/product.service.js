import product from "../models/product.model.js";
import { HTTP_STATUS } from "../common/http-status.common.js";
import Category from "../models/category.model.js";

const productService = {
  createProduct: async (body) => {
    const newProduct = await product.create(body);
    if (!newProduct) return null;
    return newProduct;
  },

  checkstocklistproducts: async (listProduct) => {
    const listProductId = listProduct.map((item) => item.productId);
    const listProductDetail = await product.find({
      _id: { $in: listProductId },
    });
    if (!listProductDetail) return null;

    //check stock all item in list product > 0 if got at least one item <= 0 return false
    const checkStock = listProductDetail.every((item) => item.stock > 0);
    if (!checkStock) return false;
    return true;
    

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
