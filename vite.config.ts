import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  root: path.join(__dirname, "src/renderer"),
  publicDir: "public",
  build: {
    outDir: "../../dist/renderer",
    emptyOutDir: true,
    rollupOptions: {
      input: path.join(__dirname, "src/renderer/index.html"),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  },
});
