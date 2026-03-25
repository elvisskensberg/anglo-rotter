"use client";

import { useEffect, useState } from "react";
import styles from "./PushSubscribeButton.module.css";

/**
 * Converts a base64 URL-encoded string to a Uint8Array.
 * Required to pass the VAPID public key to pushManager.subscribe().
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length) as Uint8Array<ArrayBuffer>;
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * PushSubscribeButton — allows users to opt in/out of browser push notifications.
 *
 * - Returns null during SSR or if push is not supported in the browser.
 * - On mount, checks if the user already has an active push subscription.
 * - Requests Notification permission and registers with the push service on subscribe.
 * - POSTs the subscription to /api/push/subscribe for server-side storage.
 */
export function PushSubscribeButton() {
  // SSR safety check — push APIs are browser-only
  if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window)) {
    return null;
  }

  return <PushSubscribeButtonInner />;
}

function PushSubscribeButtonInner() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user already has an active push subscription
    navigator.serviceWorker.ready
      .then((registration) => registration.pushManager.getSubscription())
      .then((subscription) => {
        setIsSubscribed(subscription !== null);
      })
      .catch(() => {
        // If we can't check, assume not subscribed
        setIsSubscribed(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      // Request notification permission
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        alert("Notification permission denied. Please enable it in your browser settings.");
        return;
      }

      // Get service worker registration
      const registration = await navigator.serviceWorker.ready;

      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
        console.error("NEXT_PUBLIC_VAPID_PUBLIC_KEY is not configured");
        return;
      }

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      // Extract keys from subscription
      const subscriptionJson = subscription.toJSON();
      const p256dh = subscriptionJson.keys?.p256dh;
      const auth = subscriptionJson.keys?.auth;

      if (!p256dh || !auth) {
        console.error("Push subscription keys missing");
        return;
      }

      // Send subscription to server
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: subscription.endpoint,
          keys: { p256dh, auth },
        }),
      });

      setIsSubscribed(true);
    } catch (err) {
      console.error("Failed to subscribe to push notifications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setIsLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
      }
      setIsSubscribed(false);
    } catch (err) {
      console.error("Failed to unsubscribe from push notifications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <button
      className={`${styles.button} ${isSubscribed ? styles.subscribed : ""}`}
      onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
      disabled={isLoading}
    >
      {isSubscribed ? "Notifications Enabled" : "Enable Notifications"}
    </button>
  );
}
