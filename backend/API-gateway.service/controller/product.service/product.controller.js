import axios from "axios";
import config from "../../config.js";
import * as dotenv from "dotenv";
import { HTTP_STATUS } from "../../common/http-status.common.js";
dotenv.config();

export const productController = {
  create: async (req, res) => {
    const body = req.body;
    // create
    const newProduct = await axios.post(
      `${process.env.PRODUCT_SERVICE_URL}/createProduct`,
      body,
      config
    );
    if (!newProduct)
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Tạo sản phẩm thất bại",
        success: false,
      });
    else {
      
      const newInventory = await axios.post(
        `${process.env.INVENTORY_SERVICE_URL}/createinventory`,
        body,
        config
      );
      return res.status(HTTP_STATUS.OK).json({
        message: "Tạo sản phẩm thành công!",
        success: true,
        data: newProduct.data,
      });
    }
  },
  //get product
  getProductById: async (req, res) => {
    const { idProduct } = req.params;
    // get product detail
    const productDetail = await axios.get(
      `${process.env.PRODUCT_SERVICE_URL}/getproduct/${idProduct}`,
      config
    );
    if (!productDetail)
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Tải sản phẩm thất bại!",
        success: false,
      });
    return res.status(HTTP_STATUS.OK).json({
      message: "Tải sản phẩm thành công!",
      success: true,
      data: productDetail.data,
    });
  },
  //fetch list product
  fetchListProduct: async (req, res) => {
    //fetch list
    const listProduct = await axios.get(
      `${process.env.PRODUCT_SERVICE_URL}/fetchlistproduct`,
      config
    );
    if (!listProduct)
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Tải danh sách sản phẩm thất bại!",
        success: false,
      });
    return res.status(HTTP_STATUS.OK).json({
      message: "Tải danh sách sản phẩm thành công!",
      success: true,
      data: listProduct.data,
    });
  },
  //update product
  updateProduct: async (req, res) => {
    const body = req.body;
    const { idProduct } = req.params;
    //update
    const result = await axios.put(
      `${process.env.PRODUCT_SERVICE_URL}/updateproduct/${idProduct}`,
      body,
      config
    );
    if (!result)
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Cập nhật sản phẩm thất bại",
        success: false,
      });
    return res.status(HTTP_STATUS.OK).json({
      message: "Cập nhật sản phẩm thành công!",
      success: true,
      data: result.data,
    });
  },
  //delete product
  deleteProduct: async (req, res) => {
    const { idProduct } = req.params;
    //delete
    const result = await axios.delete(
      `${process.env.PRODUCT_SERVICE_URL}/deleteproduct/${idProduct}`,
      config
    );
    if (!result)
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Xóa sản phẩm thất bại",
        success: false,
      });
    return res.status(HTTP_STATUS.OK).json({
      message: "Xóa sản phẩm thành công!",
      success: true,
      data: result.data,
    });
  },
  //get product by category
  getProductByCategory: async (req, res) => {
    const { idCategory } = req.params;
    //get product by category
    const productByCategory = await axios.get(
      `${process.env.PRODUCT_SERVICE_URL}/getproductbyCategory/${idCategory}`,
      config
    );
    if (!productByCategory)
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Tải sản phẩm theo danh mục thất bại!",
        success: false,
      });
    return res.status(HTTP_STATUS.OK).json({
      message: "Tải sản phẩm theo danh mục thành công!",
      success: true,
      data: productByCategory.data,
    });
  },
  //get product by name
  getProductByName: async (req, res) => {
    const { name } = req.params;
    //get product by name
    const productByName = await axios.get(
      `${process.env.PRODUCT_SERVICE_URL}/getproductbyname/${name}`,
      config
    );
    if (!productByName)
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Tải sản phẩm theo tên thất bại!",
        success: false,
      });
    return res.status(HTTP_STATUS.OK).json({
      message: "Tải sản phẩm theo tên thành công!",
      success: true,
      data: productByName.data,
    });
  },
};

export default productController;
