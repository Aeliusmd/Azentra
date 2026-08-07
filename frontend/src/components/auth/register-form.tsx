"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Mail, MapPin, Phone, User } from "lucide-react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { PasswordField } from "@/components/ui/password-field";
import { TextareaField } from "@/components/ui/textarea-field";
import { ApiError, registerComplex } from "@/lib/api";
import {
  validateRegister,
  type Errors,
  type RegisterValues,
} from "@/lib/validation";

const INITIAL: RegisterValues = {
  complexName: "",
  address: "",
  contactName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

export function RegisterForm() {
  const router = useRouter();
  const [values, setValues] = useState<RegisterValues>(INITIAL);
  const [errors, setErrors] = useState<Errors<RegisterValues>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function update(field: keyof RegisterValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const nextErrors = validateRegister(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await registerComplex({
        complexName: values.complexName.trim(),
        address: values.address.trim(),
        contactName: values.contactName.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        password: values.password,
      });
      router.push("/login?registered=1");
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
        id="complexName"
        label="Apartment Complex Name"
        required
        icon={Building2}
        placeholder="e.g. Sunrise Residence"
        autoComplete="organization"
        value={values.complexName}
        onChange={(event) => update("complexName", event.target.value)}
        error={errors.complexName}
      />

      <TextareaField
        id="address"
        label="Address"
        icon={MapPin}
        placeholder="Full address of the complex"
        autoComplete="street-address"
        value={values.address}
        onChange={(event) => update("address", event.target.value)}
        error={errors.address}
      />

      <InputField
        id="contactName"
        label="Contact Person Name"
        required
        icon={User}
        placeholder="Full name of the contact person"
        autoComplete="name"
        value={values.contactName}
        onChange={(event) => update("contactName", event.target.value)}
        error={errors.contactName}
      />

      <InputField
        id="email"
        label="Email Address"
        required
        type="email"
        icon={Mail}
        placeholder="Enter your email"
        autoComplete="email"
        value={values.email}
        onChange={(event) => update("email", event.target.value)}
        error={errors.email}
      />

      <InputField
        id="phone"
        label="Phone Number"
        type="tel"
        icon={Phone}
        placeholder="+1 555 123 4567"
        autoComplete="tel"
        value={values.phone}
        onChange={(event) => update("phone", event.target.value)}
        error={errors.phone}
      />

      <PasswordField
        id="password"
        label="Password"
        required
        placeholder="Create a password"
        autoComplete="new-password"
        value={values.password}
        onChange={(event) => update("password", event.target.value)}
        error={errors.password}
      />

      <PasswordField
        id="confirmPassword"
        label="Confirm Password"
        required
        placeholder="Confirm your password"
        autoComplete="new-password"
        value={values.confirmPassword}
        onChange={(event) => update("confirmPassword", event.target.value)}
        error={errors.confirmPassword}
      />

      <Button type="submit" loading={submitting}>
        {submitting ? "Registering…" : "Register Complex"}
      </Button>
    </form>
  );
}
