// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        listing: resolve(__dirname, "r/listing/index.html"),
        listings: resolve(__dirname, "r/listings/index.html"),
        login: resolve(__dirname, "r/login/index.html"),
        register: resolve(__dirname, "r/upload/index.html"),
        upload: resolve(__dirname, "r/register/index.html"),
      },
    },
  },
});
