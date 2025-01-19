/// <reference types="vitest/config" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  base: "/tea-market",
  plugins: [react()],
  server: {
    proxy: {
      "/api/": {
        target: "http://localhost:3000/tea-market/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },

  test: {
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
  },
});
