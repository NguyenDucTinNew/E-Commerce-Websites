import inventoryController from "../controllers/inventory.controller.js";
import { wrapRequestHandler } from "../utils/handle.util.js";
import { inventoryMiddleware } from "../middleware/inventory.middleware.js";
import express from "express";

const router = express.Router();

router.post(
  "/createInventory/:productId",
  // wrapRequestHandler(inventoryMiddleware),
  wrapRequestHandler(inventoryController.createInventory)
);
router.post(
  "/updateInventory/:productId",
  //wrapRequestHandler(inventoryMiddleware),
  wrapRequestHandler(inventoryController.updateInventory)
);
router.post(
  "/checkItemsInStock",
  // wrapRequestHandler(inventoryMiddleware),
  wrapRequestHandler(inventoryController.checkItemsInStock)
);
router.put(
  "/blockReserStock",
  wrapRequestHandler(inventoryController.blockReserverStock)
);
router.put(
  "/returnItemToStock",
  wrapRequestHandler(inventoryController.returnItemsafterPaymentSucces)
);
router.put(
  "/returnItemToStockPaymentFailed",
  wrapRequestHandler(inventoryController.returnItemsafterPaymenFailed)
);

export default router;
