import express from "express";
import CartRouter from "./cart.router.js";
import OrderRouter from "./order.router.js";

const router = express.Router();

const rootRoutes = [CartRouter, OrderRouter];
rootRoutes.map((route) => {
  router.use(route);
});
export default rootRoutes;
