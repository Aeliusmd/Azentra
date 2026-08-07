"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { InputField } from "@/components/ui/input-field";
import { PasswordField } from "@/components/ui/password-field";
import { ApiError, login } from "@/lib/api";
import { validateLogin, type Errors, type LoginValues } from "@/lib/validation";

const INITIAL: LoginValues = { email: "", password: "" };

export function LoginForm() {
  const router = useRouter();
  const [values, setValues] = useState<LoginValues>(INITIAL);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Errors<LoginValues>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function update(field: keyof LoginValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    // Clear the field's error as soon as the user edits it.
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const nextErrors = validateLogin(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await login({
        email: values.email.trim(),
        password: values.password,
        rememberMe,
      });
      router.push("/admin/dashboard");
    } catch (error) {
      setFormError(
        error instanceof ApiError
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {formError && <Alert>{formError}</Alert>}

      <InputField
        id="email"
        label="Email Address"
        type="email"
        icon={Mail}
        placeholder="Enter your email"
        autoComplete="email"
        value={values.email}
        onChange={(event) => update("email", event.target.value)}
        error={errors.email}
      />

      <PasswordField
        id="password"
        label="Password"
        placeholder="Enter your password"
        autoComplete="current-password"
        value={values.password}
        onChange={(event) => update("password", event.target.value)}
        error={errors.password}
      />

      <div className="flex items-center justify-between">
        <Checkbox
          id="remember-me"
          label="Remember me"
          checked={rememberMe}
          onChange={(event) => setRememberMe(event.target.checked)}
        />
        <Link
          href="/forgot-password"
          className="text-[13px] font-medium text-link hover:text-link-dark hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <Button type="submit" loading={submitting}>
        {submitting ? "Signing in…" : "Sign In"}
      </Button>
    </form>
  );
}
