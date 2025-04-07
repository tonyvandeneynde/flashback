import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [svgr(), react()],
  server: {
    proxy: {
      // Target is your backend API
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),

        configure: (proxy, _) => {
          proxy.on("error", (_, _req, _res) => {});
          proxy.on("proxyReq", (_, __, _res) => {});
          proxy.on("proxyRes", (_, __, _res) => {});
        },
      },
      "/socket.io": {
        target: "http://localhost:3000", // Adjust the target to your WebSocket server URL
        ws: true,
      },
    },
  },
});
