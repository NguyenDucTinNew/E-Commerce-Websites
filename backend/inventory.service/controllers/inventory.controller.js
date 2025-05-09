import { HTTP_STATUS } from "../../inventory.service/common/http-status.common.js";
import inventoryService from "../service/inventory.service.js";

export const inventoryController = {
  createInventory: async (req, res) => {
    try {
      const inventoryData = req.body;
      const result = await inventoryService.createInventory(inventoryData);

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

};
export default inventoryController;
