import axios from "axios";
import config from "../../config.js";
import * as dotenv from "dotenv";
import { HTTP_STATUS } from "../../common/http-status.common.js";
import { json } from "express";
dotenv.config();

export const productController = {
  create: async (req, res) => {
    try {
      const body = req.body;
      // thực hiện tìm trc nếu không có thì là cái ở dưới nếu có thì thực hiện updatekho
      let newProduct;
      try {
        newProduct = await axios.post(
          `${process.env.PRODUCT_SERVICE_URL}/createProduct`,
          body,
          config
        );
      } catch (productError) {
        // Nếu User Service trả về lỗi
        if (productError.response) {
          res.status(productError.response.status).json({
            message:
              productError.response.data.message || "Tạo sản phẩm thất bại",
            success: false,
            errors: productError.response.data.errors,
          });
        }
      }
      const productId = newProduct.data.idproductRespone._id;
      let newInventory;
      try {
        console.log(body);
        newInventory = await axios.post(
          `${process.env.INVENTORY_SERVICE_URL}/createinventory/${productId}`,
          body,
          config
        );
        console.log("I'm here");
        const returnQuantityProuct = await axios.get(
          `${process.env.PRODUCT_SERVICE_URL}/returnQuantity/${productId}`
        );
        return res.status(HTTP_STATUS.CREATED).json({
          message: "Tạo sản phẩm thành công ",
          success: true,
        });
      } catch (inventoryError) {
        try {
          await axios.delete(
            `${process.env.PRODUCT_SERVICE_URL}/delete/${productId}`,
            { productId },
            config
            /*
            router.delete(
              "/delete/:id",
              wrapRequestHandler(productController.deleteProduct)
            );
            */
          );
        } catch (productDelError) {
          console.log("Rollback Failed");
        }
        return res.status(error.response.status).json({
          message:
            inventoryError.response.data.message || "Tạo sản phẩm thất bại",
          success: false,
          errors: inventoryError.response.data.errors,
        });
      }
    } catch {
      return (
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR),
        json({
          message: "Lỗi hệ thống ",
          success: false,
        })
      );
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
