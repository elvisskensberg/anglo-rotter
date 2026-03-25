"use client";

import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISSED_KEY = "pwa-install-dismissed";
const DISMISSED_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // Already installed as standalone PWA — never show banner
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return;
    }

    // User dismissed recently — respect their preference
    try {
      const stored = localStorage.getItem(DISMISSED_KEY);
      if (stored) {
        const { dismissed } = JSON.parse(stored) as { dismissed: number };
        if (Date.now() - dismissed < DISMISSED_TTL_MS) {
          return;
        }
      }
    } catch {
      // Ignore parse errors — proceed as if not dismissed
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  const dismissPrompt = () => {
    setIsInstallable(false);
    try {
      localStorage.setItem(DISMISSED_KEY, JSON.stringify({ dismissed: Date.now() }));
    } catch {
      // Ignore storage errors
    }
  };

  return { isInstallable, promptInstall, dismissPrompt };
}
