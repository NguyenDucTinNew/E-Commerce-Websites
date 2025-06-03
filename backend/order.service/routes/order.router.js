import orderController from "../controllers/order.controller.js";
import { wrapRequestHandler } from "../utils/handle.util.js";
import express from "express";

const router = express.Router();

router.post(
  "/createCart/:userid",

  wrapRequestHandler(orderController.createCart)
);
router.post(
  "/createOrder/:userid",
  wrapRequestHandler(orderController.createOrder)
);
router.put(
  "/updateStatusOrder/:orderId",
  wrapRequestHandler(orderController.updateStatusOrder)
);
router.get("/testWorker", wrapRequestHandler(orderController.testWorker));
export default router;
