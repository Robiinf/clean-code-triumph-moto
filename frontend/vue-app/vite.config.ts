import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import autoprefixer from "autoprefixer";
import tailwind from "tailwindcss";
import { fileURLToPath, URL } from "node:url";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5174,
  },
  css: {
    postcss: {
      plugins: [autoprefixer(), tailwind()],
    },
  },
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
