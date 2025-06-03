import { orderService } from "../service/order.service.js";
import { HTTP_STATUS } from "../common/http-status.common.js";
import mongoose from "mongoose";
import {
  connectRabbitMQ,
  sendToQueue,
  consumeQueue,
} from "../testmsq/rabbitmq.model.js";

export const orderController = {
  createCart: async (req, res) => {
    const userid = new mongoose.Types.ObjectId(req.params.userid);
    const result = await orderService.createCart(userid);
    if (!result)
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        succes: false,
        message: "Tạo giỏ hàng thất bại",
      });
    return res.status(HTTP_STATUS.CREATED).json({
      succes: true,
      message: "Tạo giỏ hàng thành công",
    });
  },
  createOrder: async (req, res) => {
    const body = req.body;
    const userId = req.params.userid;
    const newOrder = await orderService.createOrderwithPendingstatus(
      userId,
      body
    );
    if (!newOrder) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Tạo đơn hàng thất bại",
      });
    }
    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "Tạo đơn hàng thành công",
      data: newOrder,
    });
  },
  updateStatusOrder: async (req, res) => {
    const orderId = req.params.orderId;
    const status = req.body.status;
    try {
      const updatedOrder = await orderService.updateOrderStatus(
        orderId,
        status
      );
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Cập nhật trạng thái đơn hàng thành công",
        data: updatedOrder,
      });
    } catch (error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  },
  testWorker: async (req, res) => {
    console.log("start worker");
    await sendToQueue("workertest1", {
      productId: 123456,
    });
    return res.status(HTTP_STATUS.OK).json({
      succes: true,
      message: "worker's working now , wait a minutes",
    });
  },
};

export default orderController;
