import { productController } from "../controller/product.service/product.controller.js";
import { wrapRequestHandler } from "../utils/handle.util.js";
import express from "express";

import authenticate from "../middleware/authenticate.js";
import checkPermission from "../middleware/checkPermission.js";

const router = express.Router();

router.post(
  "/createproduct",
  wrapRequestHandler(authenticate), // Kiểm tra quyền truy cập
  wrapRequestHandler(checkPermission(process.env.ROLE_ADMIN)), // Kiểm tra quyền truy cập
  wrapRequestHandler(productController.create)
);
router.get(
  "/getAllproduct",
  wrapRequestHandler(authenticate), // Kiểm tra quyền truy cập
  wrapRequestHandler(checkPermission(process.env.ROLE_ADMIN)),
  wrapRequestHandler(productController.fetchListProduct)
);
router.get(
  "/getproductById/:id",
  wrapRequestHandler(authenticate), // Kiểm tra quyền truy cập
  wrapRequestHandler(checkPermission(process.env.ROLE_ADMIN)),
  wrapRequestHandler(productController.getProductById)
);
router.put(
  "/updateproduct/:id",
  wrapRequestHandler(authenticate), // Kiểm tra quyền truy cập
  wrapRequestHandler(checkPermission(process.env.ROLE_ADMIN)),
  wrapRequestHandler(productController.updateProduct)
);
router.delete(
  "/deleteproduct/:id",
  wrapRequestHandler(authenticate), // Kiểm tra quyền truy cập
  wrapRequestHandler(checkPermission(process.env.ROLE_ADMIN)),
  wrapRequestHandler(productController.deleteProduct)
);
router.get(
  "/getprodutByCategory/:categoryId",
  wrapRequestHandler(authenticate), // Kiểm tra quyền truy cập
  wrapRequestHandler(checkPermission(process.env.ROLE_ADMIN)),
  wrapRequestHandler(productController.getProductByCategory)
);
router.get(
  "/getproductbyname/:name",
  wrapRequestHandler(authenticate), // Kiểm tra quyền truy cập
  wrapRequestHandler(checkPermission(process.env.ROLE_ADMIN)),
  wrapRequestHandler(productController.getProductByName)
);

export default router;
