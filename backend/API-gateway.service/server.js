import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import rootRoutes from "./routes/index.js";
import redisConfig from "./redisseting/init.redis.js";
import { RedisStore } from "connect-redis";
import session from "express-session";
import passport from "passport";
dotenv.config();
const app = express();
app.use(morgan("dev"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Initialize Redis
redisConfig.initRedis();

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
app.use(`/api/v2`, rootRoutes);
// Trong API Gateway (test route)
app.get("/test-redis", async (req, res) => {
  try {
    const redisClient = redisConfig.getRedis(); // Lấy client Redis
    const value = await redisClient.get("taolaai"); // Đọc key từ Redis
    res.json({ success: !!value, value });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3020;
app.listen(port, () => {
  console.log("🚀 Server running on port:", port);
});
