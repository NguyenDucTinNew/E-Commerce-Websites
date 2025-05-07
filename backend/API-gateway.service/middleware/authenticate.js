import { HTTP_STATUS } from "../common/http-status.common.js";

import redisConfig from "../redisseting/init.redis.js";
import jwt from 'jsonwebtoken';


export const authenticate = async (req, res, next) => {
  try {
    // 1. Lấy token từ header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // 2. Giải mã JWT để lấy sessionId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const sessionId = decoded.sessionId;
    
    // 3. Kiểm tra session trong Redis
    const sessionData = await redisConfig.getRedis().get(sessionId);
    if (!sessionData) {
      return res.status(401).json({ message: 'Session expired or invalid' });
    }
    
    // 4. Gắn thông tin user vào request
    req.user = JSON.parse(sessionData);
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
}; 

export default authenticate;
