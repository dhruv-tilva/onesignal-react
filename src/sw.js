/// <reference lib="webworker" />
import { precacheAndRoute } from "workbox-precaching";
importScripts("https://cdn.onesignal.com/sdks/OneSignalSDKWorker.js");

// Injected manifest will be placed here
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener("install", () => {
  console.log("Service Worker installing...");
});

self.addEventListener("activate", () => {
  console.log("Service Worker activated.");
});
