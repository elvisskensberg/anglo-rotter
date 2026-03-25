"use client";

import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import styles from "./InstallBanner.module.css";

export function InstallBanner() {
  const { isInstallable, promptInstall, dismissPrompt } = useInstallPrompt();

  if (!isInstallable) {
    return null;
  }

  return (
    <div className={styles.banner} role="banner" aria-label="Install MultiRotter app">
      <span>Install MultiRotter for quick access</span>
      <div className={styles.actions}>
        <button className={styles.installButton} onClick={promptInstall} type="button">
          Install
        </button>
        <button
          className={styles.dismissButton}
          onClick={dismissPrompt}
          type="button"
          aria-label="Dismiss install banner"
        >
          &#x2715;
        </button>
      </div>
    </div>
  );
}
