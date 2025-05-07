import express from "express";
import categoryRoutes from "../routes/category.route.js";
import productRoutes from "../routes/product.router.js";

const router = express.Router();

const rootRoutes = [categoryRoutes, productRoutes];
rootRoutes.map((route) => {
  router.use(route);
});
export default rootRoutes;
