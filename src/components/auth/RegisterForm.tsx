"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/lib/auth-client";
import styles from "./RegisterForm.module.css";

const USERNAME_MIN = 3;
const USERNAME_MAX = 20;
const PASSWORD_MIN = 8;
const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;

function validateFields(
  username: string,
  email: string,
  password: string
): string | null {
  if (username.length < USERNAME_MIN) {
    return `Username must be at least ${USERNAME_MIN} characters.`;
  }
  if (username.length > USERNAME_MAX) {
    return `Username must be at most ${USERNAME_MAX} characters.`;
  }
  if (!USERNAME_PATTERN.test(username)) {
    return "Username may only contain letters, numbers, and underscores.";
  }
  if (!email.includes("@")) {
    return "Please enter a valid email address.";
  }
  if (password.length < PASSWORD_MIN) {
    return `Password must be at least ${PASSWORD_MIN} characters.`;
  }
  return null;
}

export function RegisterForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const validationError = validateFields(username, email, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const result = await signUp.email({
        email,
        password,
        name: username,
      });

      if (result.error) {
        const msg = result.error.message ?? "";
        if (msg.toLowerCase().includes("email")) {
          setError("This email address is already registered.");
        } else {
          setError(msg || "Registration failed. Please try again.");
        }
      } else {
        router.push("/auth/login?registered=1");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.title}>Create Account</div>

      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.fieldRow}>
          <label htmlFor="username" className={styles.label}>
            Username:
          </label>
          <input
            id="username"
            type="text"
            required
            minLength={USERNAME_MIN}
            maxLength={USERNAME_MAX}
            autoComplete="username"
            className={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
          <div className={styles.fieldHint}>
            3–20 characters, letters/numbers/underscores only
          </div>
        </div>

        <div className={styles.fieldRow}>
          <label htmlFor="reg-email" className={styles.label}>
            Email address:
          </label>
          <input
            id="reg-email"
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
          <label htmlFor="reg-password" className={styles.label}>
            Password:
          </label>
          <input
            id="reg-password"
            type="password"
            required
            minLength={PASSWORD_MIN}
            autoComplete="new-password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <div className={styles.fieldHint}>Minimum 8 characters</div>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.submitRow}>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </div>
      </form>

      <div className={styles.loginLink}>
        Already have an account?{" "}
        <Link href="/auth/login" className={styles.link}>
          Log in
        </Link>
      </div>
    </div>
  );
}
