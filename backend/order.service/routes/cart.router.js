import express from "express";
import CartController from "../controllers/cart.controller.js";
import { wrapRequestHandler } from "../utils/handle.util.js";

const router = express.Router();

router.get("/:userId", wrapRequestHandler(CartController.getCart));
router.post("/create/:userId", wrapRequestHandler(CartController.addItem));
router.delete(
  "/:userId/items/:itemId",
  wrapRequestHandler(CartController.removeItem)
);
router.patch(
  "/:userId/items/:itemId/quantity",
  wrapRequestHandler(CartController.updateQuantity)
);
router.delete("/:userId", wrapRequestHandler(CartController.clearCart));

export default router;
