//import product from "../model/product.model.js";
import { HTTP_STATUS } from "../common/http-status.common.js";
import productService from "../service/product.service.js";
import mongoose from "mongoose";

export const productController = {
  checkstocklistproducts: async (req, res) => {
    const { listProduct } = req.body;
    const checkStock = await productService.checkstocklistproducts(listProduct);
    if (!checkStock) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Sản phẩm không đủ số lượng",
        success: false,
      });
    }
    return res.status(HTTP_STATUS.OK).json({
      message: "Sản phẩm đủ số lượng",
      success: true,
    });
  },
  createProduct: async (req, res) => {
    const body = req.body;
    // create
    const newProduct = await productService.createProduct(body);
    if (!newProduct)
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Tạo sản phẩm thất bại",
        success: false,
      });
    const idproductRespone = {
      _id: newProduct._id,
    };
    return res.status(HTTP_STATUS.OK).json({
      message: "Tạo sản phẩm thành công!",
      success: true,
      idproductRespone: idproductRespone,
    });
  },
  //get product
  getProductById: async (req, res) => {
    const { idProduct } = req.params;
    // get product detail
    const productDetail = await productService.getProductById(idProduct);
    if (!productDetail)
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Tải sản phẩm thất bại!",
        success: false,
      });
    return res.status(HTTP_STATUS.OK).json({
      message: "Tải sản phẩm thành công!",
      success: true,
      data: productDetail,
    });
  },
  //fetch list product
  fetchListProduct: async (req, res) => {
    //fetch list
    const listProduct = await productService.fetchListProduct();
    if (!listProduct)
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Tải danh sách sản phẩm thất bại!",
        success: false,
      });
    return res.status(HTTP_STATUS.OK).json({
      message: "Tải danh sách sản phẩm thành công!",
      success: true,
      data: listProduct,
    });
  },
  //update product
  updateProduct: async (req, res) => {
    const body = req.body;
    const { idProduct } = req.params;
    //update
    const result = await productService.updateProduct(idProduct, body);
    if (!result)
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Cập nhật sản phẩm thất bại",
        success: false,
      });

    return res.status(HTTP_STATUS.OK).json({
      message: "Cập nhật sản phẩm thành công!",
      success: true,
      data: result,
    });
  },
  //delete product
  deleteProduct: async (req, res) => {
    console.log("Hàm deleteProduct được gọi!");
    console.log("req.params:", req.params);

    const idProduct = new mongoose.Types.ObjectId(req.params.id);
    //delete
    const result = await productService.deleteProduct(idProduct);
    if (!result)
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: "Xóa sản phẩm thất bại",
        success: false,
      });

    return res.status(HTTP_STATUS.OK).json({
      message: "Xóa sản phẩm thành công!",
      success: true,
      data: result,
    });
  },
  getproductbyCategory: async (req, res) => {
    const { idCategory } = req.params;
    // get product detail
    const productDetail = await productService.getproductbycategory(idCategory);
    if (!productDetail)
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Tải sản phẩm thất bại!",
        success: false,
      });
    return res.status(HTTP_STATUS.OK).json({
      message: "Tải sản phẩm thành công!",
      success: true,
      data: productDetail,
    });
  },
  returnQuantity: async (req, res) => {
    const { productId } = req.params;
    console.log("idProduct", productId);
    const resProduct = await productService.returnQuantity(productId);
    if (!resProduct)
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Trả hàng thất bại",
        success: false,
      });
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Trả hàng thành công",
    });
  },
  getproductbyname: async (req, res) => {
    const { name } = req.params;
    console.log("name", name);
    // get product detail
    const productDetail = await productService.getproductbyname(name);
    if (!productDetail) {
      console.log("Failed ne con");
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Tải sản phẩm thất bại!",
        success: false,
      });
    }
    const idproductRespone = {
      _id: productDetail._id,
    };
    console.log("idproductRespone", idproductRespone);
    return res.status(HTTP_STATUS.OK).json({
      message: "tải sản phẩm thành công",
      success: true,
      idproductRespone: idproductRespone,
    });
  },
  //get product by name
};

export default productController;
