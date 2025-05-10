import { get } from "mongoose";
import OrderModel from "../models/order.Model.JS";
import OrderItemModel from "../models/orderItems.model.js";

export const orderitemsService = {
  createorderitem: async (orderItemData) => {
    try {
      const orderItem = await OrderItemModel.create(orderItemData);
      return orderItem;
    } catch (error) {
      throw new Error("Error creating order item: " + error.message);
    }
  },
  deleteorderitem: async (orderItemId) => {
    try {
      const orderItem = await OrderItemModel.findByIdAndDelete(orderItemId);
      if (!orderItem) {
        throw new Error("Order item not found");
      }
      return orderItem;
    } catch (error) {
      throw new Error("Error deleting order item: " + error.message);
    }
  },
  getorderitemById: async (orderItemId) => {
    try {
      const orderItem = await OrderItemModel.findById(orderItemId).populate(
        "orderId"
      );
      if (!orderItem) {
        throw new Error("Order item not found");
      }
      return orderItem;
    } catch (error) {
      throw new Error("Error fetching order item: " + error.message);
    }
  },
  getAllorderitems: async (query) => {
    try {
      const { page = 1, limit = 10 } = query;
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        populate: "orderId",
      };
      const orderItems = await OrderItemModel.paginate({}, options);
      return orderItems;
    } catch (error) {
      throw new Error("Error fetching order items: " + error.message);
    }
  },
  updateorderitem: async (orderItemId, orderItemData) => {
    try {
      const orderItem = await OrderItemModel.findByIdAndUpdate(
        orderItemId,
        orderItemData,
        {
          new: true,
          runValidators: true,
        }
      );
      if (!orderItem) {
        throw new Error("Order item not found");
      }
      return orderItem;
    } catch (error) {
      throw new Error("Error updating order item: " + error.message);
    }
  },
};
export default orderitemsService;
