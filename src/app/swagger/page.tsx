"use client";

import { useEffect, useState } from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function ApiDocsPage() {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Suppress legacy lifecycle warnings from swagger-ui-react in development/strict mode
    if (process.env.NODE_ENV === "development") {
      const originalError = console.error;
      console.error = (...args: any[]) => {
        const fullMessage = args.map(a => a?.toString() || "").join(" ").toLowerCase();
        if (
          fullMessage.includes("modelcollapse") ||
          fullMessage.includes("unsafe_componentwillreceiveprops")
        ) {
          return;
        }
        originalError.apply(console, args);
      };
      return () => {
        console.error = originalError;
      };
    }
  }, []);

  useEffect(() => {
    const isAuth = sessionStorage.getItem("swagger_auth") === "true";
    if (isAuth) {
      setAuthorized(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic auth - compare with env variables or hardcoded (for demo)
    const validUsername = process.env.NEXT_PUBLIC_SWAGGER_USERNAME || "admin";
    const validPassword = process.env.NEXT_PUBLIC_SWAGGER_PASSWORD || "admin123";

    if (username === validUsername && password === validPassword) {
      sessionStorage.setItem("swagger_auth", "true");
      setAuthorized(true);
      setError("");
    } else {
      setError("Invalid credentials");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("swagger_auth");
    setAuthorized(false);
    setUsername("");
    setPassword("");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
          <div className="mb-6 text-center">
            <h1 className="mb-2 text-3xl font-bold text-gray-800">NEXT-KVC API Documentation</h1>
            <p className="text-sm text-gray-600">Please authenticate to access Swagger UI</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
                required
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
            >
              Access Documentation
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Default credentials:</p>
            <p className="mt-1 font-mono">
              Username: <span className="font-semibold">nkadmin</span> | Password:{" "}
              <span className="font-semibold">admin123</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">NEXT-KVC API Documentation</h1>
            <p className="mt-1 text-sm text-blue-100">
              Interactive API documentation with 64+ endpoints
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-white/20 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/30"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="container mx-auto">
        <SwaggerUI url="/api/docs" />
      </div>
    </div>
  );
}
