import {
  get,
  set,
  incrby,
  decrby,
  exists,
  setnx,
} from "./redisseting/model.redis.js"; // Đảm bảo đường dẫn đúng
import redis from "./redisseting/init.redis.js";

redis.initRedis(); // Khởi tạo kết nối Redis
// Sử dụng các hàm
await set("testKey", "testValue");
