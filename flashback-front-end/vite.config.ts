import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Target is your backend API
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),

        configure: (proxy, options) => {
          proxy.on("error", (err, _req, _res) => {});
          proxy.on("proxyReq", (proxyReq, req, _res) => {});
          proxy.on("proxyRes", (proxyRes, req, _res) => {});
        },
      },
      "/socket.io": {
        target: "http://localhost:3000", // Adjust the target to your WebSocket server URL
        ws: true,
      },
    },
  },
});
