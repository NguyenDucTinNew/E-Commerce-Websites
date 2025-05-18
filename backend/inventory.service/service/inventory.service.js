import inventoryModel from "../models/inventory.model.js";
import { HTTP_STATUS } from "../common/http-status.common.js";

export const inventoryService = {
  createInventory: async (inventoryData, productId) => {
    try {
      // Kiểm tra xem productId đã tồn tại chưa
      const existingInventory = await inventoryModel.findOne({
        productId: productId,
      });

      if (existingInventory) {
        const resUpdate = await inventoryService.updateInventory(
          existingInventory.productId,
          inventoryData.stock
        );
        if (!resUpdate) {
          return {
            success: false,
            message: "Sản phẩm tồn tại, update thất bại",
          };
        } else {
          return {
            success: true,
            message: "Sản phẩm tồn tại, cập nhật lại số lượng kho thành công.",
            data: resUpdate,
          };
        }
      }
      // Tạo một bản ghi inventoryModel mới
      const newInventory = new inventoryModel({
        productId: productId,
        actualStock: inventoryData.stock,
        reserStock: 0, // Khởi tạo reserStock là 0
        avaliableStock: inventoryData.stock, //Khởi tạo avaliableStock bằng actualStock
        location: inventoryData.location || null, // Sử dụng giá trị mặc định nếu không được cung cấp
      });

      // Lưu bản ghi inventoryModel vào database
      const savedInventory = await newInventory.save();

      return {
        success: true,
        message: "Tạo inventory thành công.",
        data: savedInventory,
      };
    } catch (error) {
      // Xử lý lỗi
      console.error("Lỗi khi tạo inventory:", error);
      return { success: false, message: error.message };
    }
  },

  CheckavAilableStock: async (product) => {
    try {
      const productId = product.id;
      const quantity = product.quantity;

      const inventory = await inventoryModel.findOne({ productId: productId });

      if (inventory.avaliableStock < quantity)
        return { success: false, message: "Kho hiện tại không đủ hàng" };
      else {
        return {
          success: true,
          message: "Đã thêm vào giỏ hàng",
        };
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật kiểm tra kho", error);
      return { success: false, message: error.message };
    }
  },

  checkItemsInInventory: async (items) => {
    const check = await Promise.all(
      items.map(async (item) => {
        const inventory = await inventoryModel.findOne({
          productId: item.productId,
        });
        if (!inventory) {
          return false; // Không tìm thấy sản phẩm trong kho
        }
        if (inventory.avaliableStock < item.quantity) {
          return false; // Số lượng trong kho không đủ
        }
        return true; // Sản phẩm có đủ số lượng trong kho
      })
    );  
  },
  // Inventory Service
  updateInventory: async (productId, quantityToAdd) => {
    const inventory = await inventoryModel.findOne({ productId });

    if (!inventory) {
      throw new Error(`Inventory not found for product ID: ${productId}`);
    }

    inventory.actualStock += quantityToAdd;
    inventory.avaliableStock = inventory.actualStock - inventory.reserStock; // Hoặc điều chỉnh theo logic nghiệp vụ
    await inventory.save();

    return inventory;
  },
  // Bỏ hàng vào cart chứ chưa mua
  ReserveItemsbyListProducts: async (listproduct) => {
    try {
      // Lặp qua từng sản phẩm trongs listproduct
      for (const product of listproduct) {
        const productId = product.productId;
        const quantity = product.quantity;

        // Tìm bản ghi inventory của sản phẩm
        const inventory = await inventoryModel.findOne({
          productId: productId,
        });

        // Nếu không tìm thấy inventory, báo lỗi
        if (!inventory) {
          throw new Error(
            `Không tìm thấy inventory cho sản phẩm có productId: ${productId}`
          );
        }

        //Kiểm tra xem actualStock có đủ quantity không (Thực tế không thể xảy ra , nhưng ngoại lệ có thể do lỗi hệ thống)
        if (inventory.reserStock < quantity) {
          throw new Error(`LỖI NGHIỆM TRỌNG: reserveStock không đủ để trả lại. 
            Product: ${productId}, 
            Yêu cầu: ${quantity}, 
            Hiện có: ${inventory.reserStock}`);
        }
        inventory.reserStock += quantity;
        inventory.avaliableStock = inventory.actualStock - inventory.reserStock;
        // Lưu lại inventory
        await inventory.save();
      }

      // Trả về thành công
      return { success: true, message: "Đã cập nhật reserstock thành công." };
    } catch (error) {
      // Xử lý lỗi
      console.error("Lỗi khi cập nhật reserstock:", error);
      return { success: false, message: error.message };
    }
  },

  // timeoutpayment to throw all reserveStock Item

  //Return Item When TimeOUT of the order or Payment Failed
  ReturnItems: async (listproduct) => {
    try {
      // Lặp qua từng sản phẩm trong listproduct
      for (const product of listproduct) {
        const productId = product.productId;
        const quantity = product.quantity;

        // Tìm bản ghi inventory của sản phẩm
        const inventory = await inventoryModel.findOne({
          productId: productId,
        });

        // Nếu không tìm thấy inventory, báo lỗi
        if (!inventory) {
          console.error(
            `Không tìm thấy inventory cho sản phẩm có productId: ${productId}`
          );
          continue; // Bỏ qua sản phẩm này và tiếp tục với sản phẩm khác
        }

        // Kiểm tra nếu reserveStock không đủ để trả lại
        if (inventory.reserStock < quantity) {
          console.warn(
            `Số lượng reserveStock không đủ để trả lại cho sản phẩm ${productId}`
          );
          // Trả lại tối đa có thể
          quantity = inventory.reserStock;
        }

        // Trả lại hàng vào kho
        inventory.reserStock -= quantity;
        inventory.avaliableStock = inventory.actualStock - inventory.reserStock;

        // Lưu lại inventory
        await inventory.save();
      }

      // Trả về thành công
      return {
        success: true,
        message: "Đã trả lại hàng vào kho thành công.",
      };
    } catch (error) {
      // Xử lý lỗi
      console.error("Lỗi khi trả lại hàng vào kho:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  },

  ReturnItemsAfterPayment: async (listproduct) => {
    try {
      // Lặp qua từng sản phẩm trongs listproduct
      for (const product of listproduct) {
        const productId = product.productId;
        const quantity = product.quantity;

        // Tìm bản ghi inventory của sản phẩm
        const inventory = await inventoryModel.findOne({
          productId: productId,
        });

        // Nếu không tìm thấy inventory, báo lỗi
        if (!inventory) {
          throw new Error(
            `Không tìm thấy inventory cho sản phẩm có productId: ${productId}`
          );
        }

        //Kiểm tra xem actualStock có đủ quantity không (Thực tế không thể xảy ra , nhưng ngoại lệ có thể do lỗi hệ thống)
        if (inventory.reserStock < quantity) {
          throw new Error(`LỖI NGHIỆM TRỌNG: reserveStock không đủ để trả lại. 
            Product: ${productId}, 
            Yêu cầu: ${quantity}, 
            Hiện có: ${inventory.reserStock}`);
        }
        inventory.reserStock -= quantity;
        inventory.actualStock -= quantity;
        inventory.avaliableStock = inventory.actualStock - inventory.reserStock;
        // Lưu lại inventory
        await inventory.save();
      }

      // Trả về thành công
      return { success: true, message: "Cảm ơn" };
    } catch (error) {
      // Xử lý lỗi
      console.error("Lỗi khi cập nhật reserstock:", error);
      return { success: false, message: error.message };
    }
  },
};

export default inventoryService;
