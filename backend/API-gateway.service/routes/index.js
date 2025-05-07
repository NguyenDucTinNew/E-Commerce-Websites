import express from "express";
import userRoutes from "./userRouter.js";
import productRoutes from "./productRouter.js";
const router = express.Router();

const rootRoutes = [userRoutes, productRoutes];
rootRoutes.map((route) => {
  router.use(route);
});
export default rootRoutes;
