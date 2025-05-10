import orderController from "../controllers/order.controller.js";
import { wrapRequestHandler } from "../utils/handle.util.js";
import express from "express";

const router = express.Router();

router.post("/createCart/:userid", wrapRequestHandler(orderController.createCart));
export default router;
