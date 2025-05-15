import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import connectDB from "./configs/connect-db.configs.js";
import morgan from "morgan";
import rootRoutes from "./routes/index.js";

dotenv.config();
const app = express();
app.use(morgan("dev"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
// Định nghĩa routes
app.use(`/api/v1`, rootRoutes);
const port = process.env.PORT || 8084;
app.listen(port, () => {
  console.log("🚀 ~ app.listen ~ port:", port);
});
