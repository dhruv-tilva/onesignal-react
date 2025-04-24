"use client";
import OneSignal from "react-onesignal";

const getOneSignalConfig = (appId) => {
  // Configuration for different environments
  const isDev = window.location.hostname === "localhost";

  const baseConfig = {
    appId: appId,
    notifyButton: {
      enable: true,
    },
  };

  if (isDev) {
    return {
      ...baseConfig,
      allowLocalhostAsSecureOrigin: true,
      // Add your localhost URL to allowed origins
      restrictedOriginEnabled: false,
      serviceWorkerParam: { scope: "/" },
      serviceWorkerPath: "/OneSignalSDKWorker.js",
    };
  }

  return baseConfig;
};

export const useOneSignalSetup = (appId) => {
  const initializeOneSignal = async () => {
    try {
      // Get environment-specific configuration
      const config = getOneSignalConfig(appId);

      // Initialize OneSignal with config
      await OneSignal.init(config);
      console.log("here");
    } catch (err) {
      console.error("OneSignal initialization error:", err);
    }
  };

  const checkAndRequestPermission = () =>
    new Promise(async (resolve, reject) => {
      try {
        // First check if push notifications are supported
        if (!OneSignal.Notifications.isPushSupported()) {
          console.warn("Push notifications are not supported on this device");
          return;
        }

        // Clear any existing event listeners to prevent duplicates
        OneSignal.User.PushSubscription.removeEventListener("change");

        const isPushNotificationsEnabledFromOneSignal = await OneSignal.User
          .PushSubscription.optedIn; //  Get current subscription status
        const subscriptionId = await OneSignal.User.PushSubscription.id; //  Get current subscription id
        const isNotificationAllow = await OneSignal.Notifications.permission;
        const permissionNative = await OneSignal.Notifications.permissionNative;

        if (isPushNotificationsEnabledFromOneSignal) {
          resolve({ id: subscriptionId, needApiCall: false });
        } else if (
          subscriptionId &&
          isNotificationAllow &&
          permissionNative === "granted"
        ) {
          // User has permissions but needs to be resubscribed
          try {
            await OneSignal.Slidedown.promptPush();
            await OneSignal.User.PushSubscription.optIn();
            resolve({ id: subscriptionId, needApiCall: true });
          } catch (err) {
            console.error("Error during resubscription:", err);
            await OneSignal.User.PushSubscription.optOut();
          }
        } else
          OneSignal.User.PushSubscription.addEventListener(
            "change",
            (subscription) => {
              if (subscription?.current?.id && subscription?.current?.optedIn) {
                resolve({ id: subscription.current.id, needApiCall: true });
              }
            }
          );
      } catch (err) {
        console.error("Failed to handle push notification permission:", err);
      }
    });

  // Separate logout function that can be called externally
  const unSubscribe = async () =>
    new Promise(async (resolve, reject) => {
      try {
        // Remove event listener
        OneSignal.User.PushSubscription.removeEventListener("change");

        // Opt out and logout
        OneSignal.User.PushSubscription.optOut().then(() => {
          OneSignal.logout().then(() => {
            resolve();
          });
        });
      } catch (err) {
        console.error("Error during OneSignal logout:", err);
        reject();
      }
    });

  const subscribe = () =>
    new Promise(async (resolve) => {
      console.log("Subscribe");
      await initializeOneSignal();
      console.log("Subscribed");
      const res = await checkAndRequestPermission();
      resolve(res);
    });

  // Return the logout function so it can be used by the parent component
  return { unSubscribe, subscribe };
};
