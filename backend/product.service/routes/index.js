import express from "express";
import categoryRoutes from "../routes/category.route.js";

const router = express.Router();

const rootRoutes = [categoryRoutes];
rootRoutes.map((route) => {
  router.use(route);
});
export default rootRoutes;
