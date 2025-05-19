import { CartController } from "../controller/order.service/cart.service.js";
import { wrapRequestHandler } from "../utils/handle.util.js";
import express from "express";
import authenticate from "../middleware/authenticate.js";
import checkPermission from "../middleware/checkPermission.js";

const router = express.Router();
router.post(
  "/create/:userId",
  wrapRequestHandler(authenticate), // Kiểm tra quyền truy cập
  wrapRequestHandler(checkPermission(process.env.ROLE_ADMIN)), // Kiểm tra quyền truy cập
  wrapRequestHandler(CartController.addCart)
);
router.delete(
  "/:userId/items/:itemId",
  // wrapRequestHandler(authenticate), // Kiểm tra quyền truy cập
  // wrapRequestHandler(checkPermission(process.env.ROLE_ADMIN)), // Kiểm tra quyền truy cập
  wrapRequestHandler(CartController.deteleItemInCart)
);

export default router;
