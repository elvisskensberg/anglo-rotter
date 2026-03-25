import type { Metadata } from "next";
import { Suspense } from "react";
import { HeaderBar, BlueNavBar, OrangeNavBar } from "@/components/layout";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to your MultiRotter account to post threads and join discussions.",
  openGraph: {
    title: "Log In — MultiRotter",
  },
};

export default function LoginPage() {
  return (
    <div>
      <HeaderBar />
      <BlueNavBar />
      <OrangeNavBar />
      <div style={{ maxWidth: "var(--rotter-container)", margin: "0 auto" }}>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
