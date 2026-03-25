"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";

export function AuthButton() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  if (isPending) {
    return null;
  }

  if (!session) {
    return (
      <Link
        href="/auth/login"
        style={{
          color: "white",
          fontSize: "var(--rotter-size-sm)",
          fontFamily: "var(--rotter-font-primary)",
          textDecoration: "none",
        }}
      >
        Login
      </Link>
    );
  }

  const handleLogout = async () => {
    await signOut();
    router.refresh();
  };

  return (
    <span
      style={{
        color: "white",
        fontSize: "var(--rotter-size-sm)",
        fontFamily: "var(--rotter-font-primary)",
      }}
    >
      Welcome, {session.user.name}&nbsp;&nbsp;
      <button
        onClick={handleLogout}
        style={{
          background: "none",
          border: "none",
          color: "white",
          fontSize: "var(--rotter-size-sm)",
          fontFamily: "var(--rotter-font-primary)",
          cursor: "pointer",
          padding: 0,
          textDecoration: "underline",
        }}
      >
        Logout
      </button>
    </span>
  );
}
