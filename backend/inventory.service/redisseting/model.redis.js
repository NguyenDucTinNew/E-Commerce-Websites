"use strict";

import redis from "./init.redis.js";

export const get = async (key) => {
  try {
    const client = redis.getRedis();
    return await client.get(key);
  } catch (err) {
    throw err;
  }
};
export const set = async (key, value, options = {}) => {
  try {
    const client = redis.getRedis();
    if (Object.keys(options).length > 0) {
      return await client.set(key, value, options);
    }
    return await client.set(key, value);
  } catch (err) {
    throw err;
  }
};
 
export const incrby = async (key, increment) => {
  try {
    const client = redis.getRedis();
    return await client.incrBy(key, increment);
  } catch (err) {
    throw err;
  }
};

export const decrby = async (key, decrement) => {
  try {
    const client = redis.getRedis();
    return await client.decrBy(key, decrement);
  } catch (err) {
    throw err;
  }
};

export const exists = async (key) => {
  try {
    const client = redis.getRedis();
    return await client.exists(key);
  } catch (err) {
    throw err;
  }
};

export const setnx = async (key, value) => {
  try {
    const client = redis.getRedis();
    return await client.set(key, value, {
      NX: true,
    });
  } catch (err) {
    throw err;
  }
};

