import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import connectDB from "./configs/connect-db.configs.js";
import rootRoutes from "./routes/index.js";
import morgan from "morgan";
import session from "express-session";

dotenv.config();
const app = express();
app.use(morgan("dev"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// express-session settings
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Thay thế bằng chuỗi bí mật
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 100000000 * 5 }, // Thời gian cookie
    httpOnly: true,
    secure: false, // Đặt true chỉ khi bạn đang sử dụng HTTPS
  })
);

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:4200",
      "http://localhost:3001",
      "http://localhost:8080",
      "http://localhost:5000",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

// Kết nối đến cơ sở dữ liệu
connectDB();
app.get("/getsession", (req, res) => {
  res.send(req.session);
});
// Định nghĩa routes
app.use(`/api/v1`, rootRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("🚀 ~ app.listen ~ port:", port);
});
