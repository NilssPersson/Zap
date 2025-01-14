import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import config from "./src/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: config.PORT,
    host: true, // Needed for the --host flag to work
  },
});
