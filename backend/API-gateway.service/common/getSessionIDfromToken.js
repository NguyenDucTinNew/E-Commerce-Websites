import jwt from "jsonwebtoken";

export const getSessionIDfromToken = (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const sessionId = decoded.sessionId;

  //return sessionId;
  if (!sessionId) {
    return res.status(401).json({ message: "Invalid token: sessionId missing" });
  }
  return sessionId;
  
};
