import OrderModel from "../models/order.model.js";
import OrderItemModel from "../models/orderItems.model.js";
import CartModel from "../models/cart.model.js";

export const orderService = {
  createCart: async (userid) => {
    const newcart = await OrderModel.create({
      userid: userid,
      listProduct: [],
    });

    if (newcart) {
      newcart.save();
      return { succes: true, message: "Tao gio hang thanh cong" };
    }
    return { succes: false, message: "Tao gio hang that bai" };
  },

  createOrderwithPendingstatus: async (orderData) => {
    try {
      const order = new OrderModel(orderData);
      order.status = "pending"; // Set the status to pending
      await order.save();
      return order;
    } catch (error) {
      console.log(error);
      throw new Error("Error order failed");
    }
  },
  updateOrderStatus: async (orderId, status) => {
    try {
      const order = await OrderModel.findByIdAndUpdate(
        orderId,
        { status },
        { new: true, runValidators: true }
      );
      if (!order) {
        throw new Error("Order not found");
      }
      return order;
    } catch (error) {
      throw new Error("Error updating order status: " + error.message);
    }
  },

  deleteOrder: async (orderId) => {
    try {
      const order = await OrderModel.findByIdAndDelete(orderId);
      if (!order) {
        throw new Error("Order not found");
      }
      return order;
    } catch (error) {
      throw new Error("Error deleting order: " + error.message);
    }
  },
  getOrderById: async (orderId) => {
    try {
      const order = await OrderModel.findById(orderId).populate("items");
      if (!order) {
        throw new Error("Order not found");
      }
      return order;
    } catch (error) {
      throw new Error("Error fetching order: " + error.message);
    }
  },
  /*
  getAllOrders: async (query) => {
    try {
      const { page = 1, limit = 10 } = query;
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        populate: "items",
      };
      const orders = await OrderModel.paginate({}, options);
      return orders;
    } catch (error) {
      throw new Error("Error fetching orders: " + error.message);
    }
  },
  */
  updateOrder: async (orderId, orderData) => {
    try {
      const order = await OrderModel.findByIdAndUpdate(orderId, orderData, {
        new: true,
        runValidators: true,
      });
      if (!order) {
        throw new Error("Order not found");
      }
      return order;
    } catch (error) {
      throw new Error("Error updating order: " + error.message);
    }
  },
  getorderbyuserId: async (userId) => {
    try {
      const orders = await OrderModel.find({ userId }).populate("items");
      if (orders.length === 0) {
        throw new Error("Orders not found for this user");
      }
      return orders;
    } catch (error) {
      throw new Error("Error fetching orders by user ID: " + error.message);
    }
  },

  caculateTotalAmountByOrderid: async (orderId) => {
    try {
      const order = await OrderModel.findById(orderId).populate("items");
      if (!order) {
        throw new Error("Order not found");
      }
      const totalAmount = order.items.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);
      order.totalAmount = totalAmount;
      await order.save();
      return order;
    } catch (error) {
      throw new Error("Error calculating total amount: " + error.message);
    }
  },
  caculateTotalAmountByUserId: async (userId) => {
    try {
      const orders = await OrderModel.find({ userId }).populate("items");
      if (orders.length === 0) {
        throw new Error("Orders not found for this user");
      }
      const totalAmount = orders.reduce((total, order) => {
        return (
          total +
          order.items.reduce((itemTotal, item) => {
            return itemTotal + item.price * item.quantity;
          }, 0)
        );
      }, 0);
      return totalAmount;
    } catch (error) {
      throw new Error(
        "Error calculating total amount by user ID: " + error.message
      );
    }
  },
  filtereorderbytime: async (order, startTime, endTime) => {
    // i got orders and i want to filter them by time
    try {
      const filteredOrders = order.filter((order) => {
        const orderTime = new Date(order.createdAt);
        return (
          orderTime >= new Date(startTime) && orderTime <= new Date(endTime)
        );
      });
      if (filteredOrders.length === 0) {
        throw new Error("No orders found in this time range");
      }
      return filteredOrders;
    } catch (error) {
      throw new Error("Error filtering orders by time: " + error.message);
    }
  },
  filterorderbystatus: async (order, status) => {
    // i got orders and i want to filter them by status
    try {
      const filteredOrders = order.filter((order) => order.status === status);
      if (filteredOrders.length === 0) {
        throw new Error("No orders found with this status");
      }
      return filteredOrders;
    } catch (error) {
      throw new Error("Error filtering orders by status: " + error.message);
    }
  },
};

export default orderService;
