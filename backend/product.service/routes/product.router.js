import { productMiddleware } from "../middleware/product.middleware.js";
import { productController } from "../controllers/product.controller.js";
import { wrapRequestHandler } from "../utils/handle.util.js";
import express from "express";

const router = express.Router();

router.post(
  "/createProduct",
  wrapRequestHandler(productMiddleware),
  wrapRequestHandler(productController.createProduct)
);
router.get("/getAll", wrapRequestHandler(productController.getAllProduct));
router.get(
  "/getById/:id",
  wrapRequestHandler(productController.getProductById)
);
router.put(
  "/update/:id",
  wrapRequestHandler(productMiddleware),
  wrapRequestHandler(productController.updateProduct)
);
router.delete(
  "/delete/:id",
  wrapRequestHandler(productController.deleteProduct)
);
router.get(
  "/getByCategory/:categoryId",
  wrapRequestHandler(productController.getproductbyCategory)
);
router.get(
  "/getproductbyname/:name",
  wrapRequestHandler(productController.getproductbyname)
);
export default router;
