import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      strategies: "injectManifest",
      srcDir: "src",
      devOptions: {
        enabled: true,
      },
      filename: "sw.js",
      injectRegister: "auto",
      manifest: {
        name: "Dimboo",
        short_name: "Dimboo",
        description: "A Dimboo PWA.",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/logo-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/logo-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: "/index.html",
        OneSignalSDKWorker: "./public/OneSignalSDKWorker.js",
      },
    },
  },
});
