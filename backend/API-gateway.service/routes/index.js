import express from "express";
import userRoutes from "./userRouter.js";
import productRoutes from "./productRouter.js";
import cartRouter from "./cartRouter.js";
const router = express.Router();

const rootRoutes = [userRoutes, productRoutes, cartRouter];
rootRoutes.map((route) => {
  router.use(route);
});
export default rootRoutes;
