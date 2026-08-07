export type Errors<T> = Partial<Record<keyof T, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Digits, spaces and the usual separators; 7-15 digits once stripped.
const PHONE_RE = /^\+?[\d\s()-]{7,20}$/;

export type LoginValues = {
  email: string;
  password: string;
};

export function validateLogin(values: LoginValues): Errors<LoginValues> {
  const errors: Errors<LoginValues> = {};

  if (!values.email.trim()) errors.email = "Email address is required.";
  else if (!EMAIL_RE.test(values.email.trim()))
    errors.email = "Enter a valid email address.";

  if (!values.password) errors.password = "Password is required.";

  return errors;
}

export type RegisterValues = {
  complexName: string;
  address: string;
  contactName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

export function validateRegister(
  values: RegisterValues,
): Errors<RegisterValues> {
  const errors: Errors<RegisterValues> = {};

  if (!values.complexName.trim())
    errors.complexName = "Apartment complex name is required.";

  if (!values.contactName.trim())
    errors.contactName = "Contact person name is required.";

  if (!values.email.trim()) errors.email = "Email address is required.";
  else if (!EMAIL_RE.test(values.email.trim()))
    errors.email = "Enter a valid email address.";

  // Phone is optional, but validate the format when one is given.
  if (values.phone.trim() && !PHONE_RE.test(values.phone.trim()))
    errors.phone = "Enter a valid phone number.";

  if (!values.password) errors.password = "Password is required.";
  else if (values.password.length < 8)
    errors.password = "Password must be at least 8 characters.";

  if (!values.confirmPassword)
    errors.confirmPassword = "Please confirm your password.";
  else if (values.confirmPassword !== values.password)
    errors.confirmPassword = "Passwords do not match.";

  return errors;
}
