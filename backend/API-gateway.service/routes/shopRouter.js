import { createProxyMiddleware } from "http-proxy-middleware";

const shopRouter = createProxyMiddleware({
  target: "http://localhost:9090", // Địa chỉ của shop service
  changeOrigin: true,
  pathRewrite: {
    "^/api/shop": "",
  },
});

export default shopRouter;
