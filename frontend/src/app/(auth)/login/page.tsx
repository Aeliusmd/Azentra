import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function LoginPage() {
  return (
    <>
      <div className="mt-8 rounded-lg border border-hairline bg-white p-8 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        <h1 className="sr-only">Sign in to Azentra</h1>
        <LoginForm />
      </div>

      <p className="mt-8 text-center text-[13px] text-gray-400">
        Authorized personnel only.
      </p>
    </>
  );
}
