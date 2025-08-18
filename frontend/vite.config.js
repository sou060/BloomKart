import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true, // This will fail if the port is in use, which is good for debugging
    hmr: {
      host: "localhost",
      protocol: "ws",
      port: 5173,// Explicitly set the hmr port
    },
  },
});
