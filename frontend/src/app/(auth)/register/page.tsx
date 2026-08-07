import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Register Your Complex",
};

export default function RegisterPage() {
  return (
    <>
      <div className="mt-8 rounded-lg border border-hairline bg-white p-8 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        <h1 className="text-lg font-semibold text-ink">Register Your Complex</h1>
        <p className="mt-1 mb-6 text-[13px] text-muted">
          Fill in the details to get started with Azentra.
        </p>
        <RegisterForm />
      </div>

      <footer className="mt-6 text-center">
        <p className="text-[13px] text-muted">Already have an account?</p>
        <Link
          href="/login"
          className="text-[13px] font-semibold text-link hover:text-link-dark hover:underline"
        >
          Sign In
        </Link>
        <p className="mt-4 text-xs text-gray-400">
          By registering, you agree to our{" "}
          <Link href="/terms" className="hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </footer>
    </>
  );
}
