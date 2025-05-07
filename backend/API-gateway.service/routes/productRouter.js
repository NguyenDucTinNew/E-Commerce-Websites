import { productController } from "../controller/product.service/product.controller.js";
import { wrapRequestHandler } from "../utils/handle.util.js";
import express from "express";
import authenticate from "../middleware/authenticate.js";
import checkPermission from "../middleware/checkPermission.js";

const router = express.Router();

router.post(
  "/create",
  wrapRequestHandler(authenticate), // Kiểm tra quyền truy cập
  wrapRequestHandler(checkPermission("admin")), // Kiểm tra quyền truy cập
  wrapRequestHandler(productController.create)
);
router.get(
  "/getAll",
  wrapRequestHandler(authenticate), // Kiểm tra quyền truy cập
  wrapRequestHandler(checkPermission("admin")),
  wrapRequestHandler(productController.fetchListProduct)
);
router.get(
  "/getById/:id",
  wrapRequestHandler(authenticate), // Kiểm tra quyền truy cập
  wrapRequestHandler(checkPermission("admin")),
  wrapRequestHandler(productController.getProductById)
);
router.put(
  "/update/:id",
  wrapRequestHandler(authenticate), // Kiểm tra quyền truy cập
  wrapRequestHandler(checkPermission("admin")),
  wrapRequestHandler(productController.updateProduct)
);
router.delete(
  "/delete/:id",
  wrapRequestHandler(authenticate), // Kiểm tra quyền truy cập
  wrapRequestHandler(checkPermission("admin")),
  wrapRequestHandler(productController.deleteProduct)
);
router.get(
  "/getByCategory/:categoryId",
  wrapRequestHandler(authenticate), // Kiểm tra quyền truy cập
  wrapRequestHandler(checkPermission("admin")),
  wrapRequestHandler(productController.getProductByCategory)
);
router.get(
  "/getproductbyname/:name",
  wrapRequestHandler(authenticate), // Kiểm tra quyền truy cập
  wrapRequestHandler(checkPermission("admin")),
  wrapRequestHandler(productController.getProductByName)
);

export default router;
