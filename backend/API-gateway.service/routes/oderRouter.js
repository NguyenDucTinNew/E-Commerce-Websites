import {orderController} from "../controller/order.service/order.service.js";
import { wrapRequestHandler } from "../utils/handle.util.js";
import express from "express";
import authenticate from "../middleware/authenticate.js";
import checkPermission from "../middleware/checkPermission.js";

const router = express.Router();

router.post(
"/CreateOder",
// wrapRequestHandler(authenticate), // Kiểm tra quyền truy cập
// wrapRequestHandler(checkPermission(process.env.ROLE_ADMIN)), // Kiểm tra quyền truy cập
wrapRequestHandler(orderController.createOrder) // Tạo đơn hàng
)
export default router;