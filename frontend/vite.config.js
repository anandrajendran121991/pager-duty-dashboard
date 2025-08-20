import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    host: true,
    watch: {
      usePolling: true,
    },
    proxy: {
      "/api": {
        target: "http://express-backend:5001", // docker-compose service name
        changeOrigin: true,
      },
    },
  },
});
