// init.redis.js

import redis from "redis";

let client = {};
const statusConnectRedis = {
  CONNECT: "connect",
  END: "end",
  DISCONNECT: "disconnect",
  ERROR: "error",
};

const handleStatusConnectRedis = (connectionRedis) => {
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
  const instanceRedis = redis.createClient();
  client.instanceConnect = instanceRedis;
  handleStatusConnectRedis(instanceRedis);

  instanceRedis.connect().catch((err) => {
    console.log("Failed to connect to Redis:", err);
  });
};

const getRedis = () => client.instanceConnect;

const closeRedis = async () => {
  if (client.instanceConnect) {
    await client.instanceConnect.quit();
    console.log("Redis connection closed");
  }
};

const getSessionFromRedis = async (sessionId) => {
  try {
    const sessionData = await client.instanceConnect.get(sessionId);
    if (!sessionData) {
      return null;
    }
    return JSON.parse(sessionData);
  } catch (error) {
    throw new Error("Error fetching session: " + error.message);
  }
};


export default {
  initRedis,
  getRedis,
  closeRedis,
  getSessionFromRedis,
};
