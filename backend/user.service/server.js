import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import connectDB from "./configs/connect-db.configs.js";
import userRoutes from "./routes/userRoute.js";
import morgan from "morgan";
import passport from "passport";
import session from "express-session";
import redisConfig from "./configs/init.redis.js"; // Nhập file cấu hình Redis
import { RedisStore } from "connect-redis";

dotenv.config();
const app = express();
app.use(morgan("dev"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Initialize Redis
redisConfig.initRedis();
// Create Redis store
const redisStore = new RedisStore({
  client: redisConfig.getRedis(), // Your Redis client
  prefix: "mysession:", // Optional key prefix
  ttl: 86400, // Session TTL in seconds (optional)
});
// express-session settings
app.use(
  session({
    store: redisStore, // Sử dụng RedisStore
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: false,
    },
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    exposedHeaders: ["Authorization"],
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

// Database connection
connectDB();

app.use(`/api/v1`, userRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("🚀 Server running on port:", port);
});
// Trong user.service (test route)
app.get("/test-redis", async (req, res) => {
  try {
    const redisClient = redisConfig.getRedis(); // Lấy client Redis
    const value = await redisClient.get("taolaai"); // Đọc key từ Redis
    res.json({ success: !!value, value });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Đóng kết nối Redis khi ứng dụng dừng
process.on("SIGINT", async () => {
  await redisConfig.closeRedis();
  process.exit();
});
