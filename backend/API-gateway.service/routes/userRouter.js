import { createProxyMiddleware } from "http-proxy-middleware";

const userRouter = createProxyMiddleware({
  target: "http://localhost:8080", // Địa chỉ của user service
  changeOrigin: true,
  pathRewrite: {
    "^/api/users": "",
  },
});

export default userRouter;
