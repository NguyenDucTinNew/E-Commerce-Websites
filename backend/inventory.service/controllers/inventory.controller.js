import { HTTP_STATUS } from "../../inventory.service/common/http-status.common.js";
import inventoryService from "../service/inventory.service.js";
import Inventory from "../models/inventory.model.js";
import {
  get,
  set,
  incrby,
  decrby,
  exists,
  setnx,
} from "../redisseting/model.redis.js"; // Đảm bảo đường dẫn đúng
import redis from "../redisseting/init.redis.js";
redis.initRedis();
export const inventoryController = {
  testredis: async (req, res) => {
    const result = await inventoryService.testredis();
    if (result)
      return res.status(HTTP_STATUS.CREATED).json({
        message: result.message,
        data: result.data,
      });
  },
  checkMultiStock: async (req, res) => {
    const products = req.body.listproduct;
    console.log(products);
    try {
      let numberSold, stock;
      const stockResults = await Promise.all(
        products.map(async (product) => {
          const productId = product.productId;
          console.log(productId);
          const keyStock = `stock:${productId}`;

          // Kiểm tra tồn tại kho
          const getStock = await exists(keyStock);
          if (!getStock) {
            try {
              const stockProduct = await Inventory.findOne({
                productId,
              }).select("avaliableStock");

              if (stockProduct) {
                console.log(stockProduct.avaliableStock); // Kiểm tra xem giá trị có tồn tại
              } else {
                console.log(
                  "Không tìm thấy sản phẩm với productId:",
                  productId
                );
              }
              await set(keyStock, stockProduct.avaliableStock); // Sử dụng availableStock
            } catch (err) {
              return {
                success: false,
                message: "lỗi tìm kho",
                err: "Không tìm thấy kho",
              };
            }
          }

          stock = await get(keyStock);
          const keyProduct = `key_product:${productId}`;
          const getkey = await exists(keyProduct);
          if (!getkey) {
            await setnx(keyProduct, 0);
          }

          numberSold = await get(keyProduct);
          numberSold = await incrby(keyProduct, product.quantity);
          if (numberSold > stock) {
            console.log("Hết hàng");
            return {
              success: false,
              message: `Không đủ hàng, ${productId}`,
            };
          }
          if (numberSold > stock) {
            await set("banquaroi", 1);
            console.log("musasi");
          }
          console.log(stock);
          return {
            productId: product.productId,
            quantity: product.quantity,
            price: product.price,
          };
        })
      );
      if (numberSold > stock) {
        return res.json({
          success: false,
          checkedItems: stockResults,
        });
      } else {
        return res.json({
          success: true,
          checkedItems: stockResults,
        });
      }
    } catch (error) {
      console.error("Lỗi:", error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Lỗi server",
      });
    }
  },
  createInventory: async (req, res) => {
    try {
      const { productId } = req.params;
      const inventoryData = req.body;
      const result = await inventoryService.createInventory(
        inventoryData,
        productId
      );

      if (result.success) {
        return res.status(HTTP_STATUS.CREATED).json({
          message: result.message,
          data: result.data,
        });
      } else {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: result.message });
      }
    } catch (error) {
      console.error("Lỗi trong inventoryController.createInventory:", error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: "Lỗi server nội bộ" });
    }
  },
  updateInventory: async (req, res) => {
    try {
      const { productId } = req.params;
      const stock = req.body.stock;
      const result = await inventoryService.updateInventory(productId, stock);
      if (result) {
        return res.status(HTTP_STATUS.OK).json({
          message: "Cập nhật số lượng kho thành công",
          data: result,
        });
      } else {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          message: "Cập nhật số lượng kho thất bại",
        });
      }
    } catch (error) {
      console.error("Lỗi trong inventoryController.updateInventory:", error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: "Lỗi server nội bộ" });
    }
  },
  checkItemsInStock: async (req, res) => {
    const body = req.body;
    const result = await inventoryService.checkItemsInInventory(body);
    if (result) {
      return res.status(HTTP_STATUS.OK).json({
        message: "Tất cả sản phẩm đều có sẵn trong kho",
        success: true,
      });
    } else {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Có sản phẩm không đủ số lượng trong kho",
        success: false,
      });
    }
  },
  blockReserverStock: async (req, res) => {
    const body = req.body;
    const resBlockReservver = await inventoryService.ReserveItemsbyListProducts(
      body
    );
    if (resBlockReservver) {
      return res.status(HTTP_STATUS.OK).json({
        message: resBlockReservver.message,
        success: true,
      });
    } else {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: resBlockReservver.message,
        success: false,
      });
    }
  },
  returnItemsafterPaymentSucces: async (req, res) => {
    const body = req.body;
    const resReturnItems = await inventoryService.ReturnItemsAfterPaymentSucces(
      body
    );
    if (resReturnItems) {
      return res.status(HTTP_STATUS.OK).json({
        message: resReturnItems.message,
        success: true,
      });
    } else {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: resReturnItems.message,
        success: false,
      });
    }
  },
  returnItemsafterPaymenFailed: async (req, res) => {
    const body = req.body;
    const resReturnItems = await inventoryService.ReturnItemsAfterPaymentFailed(
      body
    );
    if (resReturnItems) {
      return res.status(HTTP_STATUS.OK).json({
        message: resReturnItems.message,
        success: true,
      });
    } else {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: resReturnItems.message,
        success: false,
      });
    }
  },
  testRedisWrokingWithInventory: async (req, res) => {
    try {
    } catch (err) {
      console.error(
        "Lỗi trong inventoryController.testRedisWrokingWithInventory:",
        err
      );
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: "Lỗi server nội bộ" });
    }
  },
};
export default inventoryController;
