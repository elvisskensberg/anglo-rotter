import type { Metadata } from "next";
import styles from "./offline.module.css";

export const metadata: Metadata = {
  title: "Offline",
  description: "You are currently offline. Cached content may still be available.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OfflinePage() {
  return (
    <main className={styles.container}>
      <header className={styles.header}>MultiRotter</header>
      <section className={styles.content}>
        <p className={styles.title}>You&apos;re offline</p>
        <p className={styles.message}>
          Cached content may still be available. Check your connection and try again.
        </p>
        <a href="/" className={styles.retryLink}>
          Try Again
        </a>
      </section>
    </main>
  );
}
