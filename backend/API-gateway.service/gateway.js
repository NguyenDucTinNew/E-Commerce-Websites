import express from "express";
import userRouter from "./routes/userRouter.js";
import shopRouter from "./routes/shopRouter.js";

const app = express();
app.use(express.json()); // Để phân tích dữ liệu JSON

// Sử dụng router cho user service
app.use("/api/users", userRouter);

// Sử dụng router cho shop service
app.use("/api/shop", shopRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API Gateway is running on port ${port}`);
});
export default app;
// Đoạn mã này tạo một API Gateway sử dụng Express.js để định tuyến các yêu cầu đến các dịch vụ khác nhau (user service và shop service).