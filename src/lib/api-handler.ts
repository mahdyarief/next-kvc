import { NextRequest, NextResponse } from "next/server";
import { AppError } from "./errors";
import { api } from "./api-response";

type ApiHandler = (req: NextRequest, ...args: any[]) => Promise<NextResponse | Response>;

export function withErrorHandler(handler: ApiHandler) {
  return async (req: NextRequest, ...args: any[]) => {
    try {
      return await handler(req, ...args);
    } catch (error: unknown) {
      console.error("[API ERROR]", error);

      if (error instanceof AppError) {
        return api.error(error.message, error.statusCode);
      }

      if (error && typeof error === "object" && "name" in error && error.name === "ZodError" && "flatten" in error && typeof error.flatten === "function") {
        return api.error("Validation Error", 400, error.flatten());
      }

      const message = error instanceof Error ? error.message : "Unknown error";
      return api.serverError("Something went wrong", process.env.NODE_ENV === "development" ? message : undefined);
    }
  };
}
