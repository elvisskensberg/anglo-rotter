import {
  CacheFirst,
  ExpirationPlugin,
  NetworkFirst,
  Serwist,
  StaleWhileRevalidate,
} from "serwist";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const runtimeCaching = [
  // API routes — NetworkFirst: always try network, fall back to cache
  {
    matcher: /\/api\/.*/i,
    handler: new NetworkFirst({
      cacheName: "api-cache",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 64,
          maxAgeSeconds: 24 * 60 * 60, // 1 day
        }),
      ],
      networkTimeoutSeconds: 10,
    }),
  },
  // Next.js static build assets — CacheFirst: immutable content-hashed files
  {
    matcher: /\/_next\/static\/.*/i,
    handler: new CacheFirst({
      cacheName: "static-cache",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 128,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        }),
      ],
    }),
  },
  // Image and SVG assets — CacheFirst: rarely changes, large payload saved
  {
    matcher: /\.(?:png|gif|jpg|jpeg|svg|webp|ico)$/i,
    handler: new CacheFirst({
      cacheName: "image-cache",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 64,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        }),
      ],
    }),
  },
  // HTML navigations — StaleWhileRevalidate: serve cached page instantly, refresh in background
  {
    matcher: /^https?:\/\/.*/i,
    handler: new StaleWhileRevalidate({
      cacheName: "page-cache",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 1 day
        }),
      ],
    }),
  },
];

const serwist = new Serwist({
  precacheEntries: [...(self.__SW_MANIFEST ?? []), "/offline"],
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching,
  fallbacks: {
    entries: [
      {
        url: "/offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

serwist.addEventListeners();

// Push notification handler — shows a browser notification when a push arrives.
// Must be added AFTER serwist.addEventListeners() to avoid conflicts.
self.addEventListener("push", (event) => {
  if (!event.data) return;
  const data = event.data.json() as { title: string; body: string; url?: string };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-192x192.png",
      data: { url: data.url ?? "/" },
    })
  );
});

// Notification click handler — focuses an existing tab or opens a new window.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data as { url?: string })?.url ?? "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      for (const client of clients) {
        if (client.url === url && "focus" in client) return client.focus();
      }
      return self.clients.openWindow(url);
    })
  );
});
