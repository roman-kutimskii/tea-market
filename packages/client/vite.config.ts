/// <reference types="vitest/config" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
const basePath = "/tea-market/";

export default defineConfig({
  base: basePath,
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
  },
  server: {
    proxy: {
      "/tea-market/api": {
        target: `https://www.roman-kutimskii.tech`,
        secure: false,
      },
    },
  },

  // server: {
  //   proxy: {
  //     "/tea-market/api": {
  //       target: `http://localhost:3000`,
  //     },
  //   },
  // },
});
