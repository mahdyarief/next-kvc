import { NextResponse } from "next/server";

export type ApiResponse<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  meta?: unknown;
};

export const api = {
  success: <T>(data: T, message?: string, meta?: unknown) => {
    return NextResponse.json({
      success: true,
      message,
      data,
      meta,
    });
  },

  error: (message: string, status: number = 400, error?: unknown) => {
    return NextResponse.json(
      {
        success: false,
        message,
        error,
      },
      { status }
    );
  },

  unauthorized: (message: string = "Unauthorized") => {
    return api.error(message, 401);
  },

  forbidden: (message: string = "Forbidden") => {
    return api.error(message, 403);
  },

  notFound: (message: string = "Not Found") => {
    return api.error(message, 404);
  },

  serverError: (message: string = "Internal Server Error", error?: string) => {
    return api.error(message, 500, error);
  },
};
