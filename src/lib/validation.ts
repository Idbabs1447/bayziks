export function isValidEmail(value: unknown): value is string {
  return typeof value === "string" && value.trim().length <= 254 && value.trim().length >= 5 && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value.trim());
}

export function cleanString(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength + 1) : "";
}

export type FormResponse = {
  status: "subscribed" | "pending" | "existing" | "sent" | "preview" | "error";
  message: string;
  errors?: Record<string, string>;
};
