import type { Metadata } from "next";
import { HeaderBar, BlueNavBar, OrangeNavBar } from "@/components/layout";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Create a MultiRotter account to post threads, reply to discussions, and rate content.",
  openGraph: {
    title: "Create Account — MultiRotter",
  },
};

export default function RegisterPage() {
  return (
    <div>
      <HeaderBar />
      <BlueNavBar />
      <OrangeNavBar />
      <div style={{ maxWidth: "var(--rotter-container)", margin: "0 auto" }}>
        <RegisterForm />
      </div>
    </div>
  );
}
