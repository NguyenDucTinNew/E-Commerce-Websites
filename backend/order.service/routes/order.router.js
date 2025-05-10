import router from "../../user.service/routes/userRoute";
import orderController from "../controllers/order.controller";
import { wrapRequestHandler } from "../utils/handle.util";
import express from    "express"

const router = express.Router();

router.post("/createCart",
    wrapRequestHandler(orderController.createCart())
)
export default router
