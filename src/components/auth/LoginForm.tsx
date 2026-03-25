"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";
import styles from "./LoginForm.module.css";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered") === "1";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn.email({ email, password });

      if (result.error) {
        setError(result.error.message ?? "Invalid credentials. Please try again.");
      } else {
        router.push("/");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.title}>Log In</div>
      {registered && (
        <div className={styles.success}>
          Account created successfully. You can now log in.
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.fieldRow}>
          <label htmlFor="email" className={styles.label}>
            Email address:
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className={styles.fieldRow}>
          <label htmlFor="password" className={styles.label}>
            Password:
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.submitRow}>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </div>
      </form>

      <div className={styles.registerLink}>
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className={styles.link}>
          Register
        </Link>
      </div>
    </div>
  );
}
