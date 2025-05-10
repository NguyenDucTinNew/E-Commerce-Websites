import express from "express";
import { userController } from "../controller/user.service/user.controller.js";
import { authController } from "../controller/user.service/auth.controller.js";
import { wrapRequestHandler } from "../utils/handle.util.js";
import { HTTP_STATUS } from "../common/http-status.common.js";
import authenticate from "../middleware/authenticate.js";
import checkPermission from "../middleware/checkPermission.js";

//import checkPremission from "../middleware/checkPermission.js";

const router = express.Router();

router.post("/login", wrapRequestHandler(authController.login));

router.post("/register", wrapRequestHandler(authController.register));
// router.get(
//   "/getsessionrole",
//   wrapRequestHandler(authController.isAuthenticated), // Kiểm tra quyền truy cập
//   wrapRequestHandler(authController.getSessionRole)
// );
// router.get(
//   "/test",
//   wrapRequestHandler(authController.isAuthenticated), // Kiểm tra quyền truy cập
//   wrapRequestHandler(authenticate),
//   wrapRequestHandler(checkPermission("admin")), // Kiểm tra quyền truy cập
//   wrapRequestHandler(userController.test)
// );
router.get(
  "/getuserbyid/:idUser",
  wrapRequestHandler(authenticate), // Kiểm tra quyền truy cập
  wrapRequestHandler(userController.getProfile) // Lấy thông tin profile
);

export default router;
