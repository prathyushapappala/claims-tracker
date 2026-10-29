import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Forward /api calls to the Express server so we don't need full URLs in the client
    proxy: { "/api": "http://localhost:4000" },
  },
});
