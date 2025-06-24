import { z } from "zod";

export class CustomError extends Error {
  statusCode;

  constructor(message, statusCode) {
    super(message.startsWith("\n") ? "Internal Server Error" : message);
    this.statusCode = statusCode;
  }
}

export const handleError = (err, res) => {
  if (err instanceof z.ZodError) {
    throw new CustomError(err.errors.map((e) => e.message).join(", "), 400);
  }
  throw new CustomError(
    err.message || "Internal Server Error",
    err.statusCode || 500
  );
};
