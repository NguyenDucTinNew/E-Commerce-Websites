import express from "express";
import userRoutes from "./userRouter.js";
const router = express.Router();

const rootRoutes = [userRoutes];
rootRoutes.map((route) => {
  router.use(route);
});
export default rootRoutes;
