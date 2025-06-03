import axios from "axios";
import config from "../../config.js";
import * as dotenv from "dotenv";
import { HTTP_STATUS } from "../../common/http-status.common.js";
import redisConfig from "../../redisseting/init.redis.js";
import { json } from "express";
import { sendToRabbitMQ } from "../../testmsq/rabbitmq.js"; // Adjust the import path as necessary
dotenv.config();

export const orderController = {
  // createOrder: async (req, res) => {
  //   try {
  //     let ResNewOrder;
  //     let ResInventory;
  //     const userId = await redisConfig.getRedis().get("userId");
  //     const listItems = req.body;
  //     // Check List Items First
  //     try {
  //       ResInventory = await axios.post(
  //         `${process.env.INVENTORY_SERVICE_URL}/checkItemsInStock`,
  //         listItems,
  //         config
  //       );

  //       // Create Order
  //       try {
  //         ResNewOrder = await axios.post(
  //           `${process.env.ORDER_SERVICE_URL}/createOrder/${userId}`,
  //           listItems,
  //           config
  //         );
  //         return res.status(HTTP_STATUS.CREATED).json({
  //           success: true,
  //           message: ResNewOrder.data.message,
  //           data: ResNewOrder.data.data,
  //         });
  //       } catch (errResNewOrder) {
  //         return res.status(HTTP_STATUS.BAD_REQUEST).json({
  //           message: ResNewOrder.data.message,
  //           error: err.message,
  //           success: false,
  //         });
  //       }
  //     } catch (errInventory) {
  //       return res.status(HTTP_STATUS.BAD_REQUEST).json({
  //         message: ResInventory.data.message,
  //         success: false,
  //       });
  //     }
  //   } catch (ErrServer) {
  //     console.log(ErrServer);
  //     return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
  //       message: "Internal server error",
  //       error: ErrServer.message,
  //     });
  //   }
  // },
  createOrder: async (req ,res) => {
   let listproduct = req.body;
   let userId = await redisConfig.getRedis().get("userId");
    try{
    //check items in stock
    const resCheckInventory = await axios.post(
      `${process.env.INVENTORY_SERVICE_URL}/checkItemsInStock`,
      { listproduct:  listproduct},
      config
    );     
    if(!resCheckInventory.data.success){
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: resCheckInventory.data.message,
        success: false,
      });
    }
    
    const resCreateOrder = await axios.post(
      `${process.env.ORDER_SERVICE_URL}/createOrder/${userId}`,
      listproduct,
      config
    );
    
       // 2. Đẩy vào queue xử lý order
    await sendToRabbitMQ('order_queue', {
      userId,
      products,
      status: 'PENDING'
    });

    res.json({ 
      status: 'PROCESSING', 
      orderId: resCreateOrder.data.data._id,
    });
    }catch(err){
      console.log(err);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
        error: err.message,
      });
    } 

  },
};

export default orderController;
