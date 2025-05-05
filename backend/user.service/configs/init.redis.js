import redis from "redis";

let client = {};
const statusConnectRedis = {
  CONNECT: "connect",
  END: "end",
  DISCONNECT: "disconnect",
  ERROR: "error",
};

const handleStatusConnectRedis = (connectionRedis) => {
  // CHECK STATUS CONNECTION REDIS
  connectionRedis.on(statusConnectRedis.CONNECT, () => {
    console.log("Redis connected successfully");
  });
  connectionRedis.on(statusConnectRedis.END, () => {
    console.log("Redis connection ended");
  });
  connectionRedis.on(statusConnectRedis.DISCONNECT, () => {
    console.log("Redis disconnected");
  });
  connectionRedis.on(statusConnectRedis.ERROR, (err) => {
    console.log("Redis connection error:", err);
  });
};

const initRedis = () => {
  // tao instance redis
  const instanceRedis = redis.createClient();
  client.instanceConnect = instanceRedis;
  handleStatusConnectRedis(instanceRedis);

  // Kết nối đến Redis
  instanceRedis.connect().catch((err) => {
    console.log("Failed to connect to Redis:", err);
  });
};
// Return curnter redis instance 
const getRedis = () => client.instanceConnect;

const closeRedis = async () => {
  if (client.instanceConnect) {
    await client.instanceConnect.quit();
    console.log("Redis connection closed");
  }
};

export default {
  initRedis,
  getRedis,
  closeRedis,
};
