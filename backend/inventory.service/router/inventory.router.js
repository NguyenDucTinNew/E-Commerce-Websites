import inventoryController from "../controllers/inventory.controller.js";
import { wrapRequestHandler } from "../utils/handle.util.js";
import { inventoryMiddleware } from "../middleware/inventory.middleware.js";
import express from "express";

const router = express.Router();

router.post(
  "/createinventory",
  wrapRequestHandler(inventoryMiddleware),
  wrapRequestHandler(inventoryController.createInventory)
);

export default router;
