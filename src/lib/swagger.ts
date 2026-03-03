import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = () => {
  const spec = createSwaggerSpec({
    apiFolder: "src/app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "NEXT-KVC API Documentation",
        version: "1.2.0",
        description: `
# NEXT-KVC API Documentation - Complete API Reference

Professional Dashboard Starter with core management endpoints for a robust application foundation.

## 🔐 Authentication
All endpoints require authentication via:
1. **API Key Header**: \`X-API-Key: your-api-key\`
2. **Session Cookie**: \`next-auth.session-token\` (automatically sent by browser)

## 📋 Common Parameters
- **userId**: Unique identifier for a system user (CUID format).
- **role**: System roles: \`SUPERADMIN\`, \`ADMIN\`, \`USER\`.

## 📊 Performance
- Optimized for high-frequency dashboard interactions.
- Real-time updates delivered via Socket.IO.
                `,
      },
      servers: [
        {
          url: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
          description: "API Server",
        },
      ],
      components: {
        securitySchemes: {
          ApiKeyAuth: {
            type: "apiKey",
            in: "header",
            name: "X-API-Key",
            description: "API Key for authentication",
          },
          SessionAuth: {
            type: "apiKey",
            in: "cookie",
            name: "next-auth.session-token",
            description: "Session cookie (browser only)",
          },
        },
        schemas: {
          // Common Schemas
          Error: {
            type: "object",
            properties: {
              error: { type: "string", example: "Unauthorized" },
            },
          },
          Success: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              message: { type: "string", example: "Operation successful" },
            },
          },
          User: {
            type: "object",
            properties: {
              id: { type: "string", example: "clx123abc" },
              name: { type: "string", example: "John Doe" },
              email: { type: "string", example: "john@example.com" },
              role: { type: "string", enum: ["SUPERADMIN", "ADMIN", "USER"], example: "ADMIN" },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
          Notification: {
            type: "object",
            properties: {
              id: { type: "string" },
              title: { type: "string" },
              message: { type: "string" },
              read: { type: "boolean" },
              type: { type: "string", enum: ["SYSTEM", "ALERT", "INFO"] },
              createdAt: { type: "string", format: "date-time" },
            },
          },
        },
        responses: {
          Unauthorized: {
            description: "Unauthorized - Invalid or missing API key",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "Unauthorized" },
              },
            },
          },
          Forbidden: {
            description: "Forbidden - Access denied",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "Forbidden - Access denied" },
              },
            },
          },
          NotFound: {
            description: "Resource not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "Resource not found" },
              },
            },
          },
        },
      },
      paths: {
        "/auth/sign-up": {
          post: {
            tags: ["Authentication"],
            summary: "Register a new user",
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["name", "email", "password"],
                    properties: {
                      name: { type: "string" },
                      email: { type: "string" },
                      password: { type: "string" },
                    },
                  },
                },
              },
            },
            responses: {
              200: {
                description: "User registered",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: { type: "boolean" },
                        user: { $ref: "#/components/schemas/User" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "/notifications": {
          get: {
            tags: ["Notifications"],
            summary: "List current user notifications",
            security: [{ ApiKeyAuth: [] }, { SessionAuth: [] }],
            responses: {
              200: {
                description: "List of notifications",
                content: {
                  "application/json": {
                    schema: { type: "array", items: { $ref: "#/components/schemas/Notification" } },
                  },
                },
              },
              401: { $ref: "#/components/responses/Unauthorized" },
            },
          },
        },
        "/settings/system": {
          get: {
            tags: ["Settings"],
            summary: "Get system configuration",
            security: [{ ApiKeyAuth: [] }, { SessionAuth: [] }],
            responses: {
              200: {
                description: "System settings",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        appName: { type: "string" },
                        enableRegistration: { type: "boolean" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "/system/check-updates": {
          post: {
            tags: ["System"],
            summary: "Check for application updates",
            security: [{ ApiKeyAuth: [] }, { SessionAuth: [] }],
            responses: {
              200: {
                description: "Update status",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: { type: "boolean" },
                        version: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "/user": {
          get: {
            tags: ["User"],
            summary: "Get current user profile",
            security: [{ ApiKeyAuth: [] }, { SessionAuth: [] }],
            responses: {
              200: {
                description: "User profile",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
        },
        "/users": {
          get: {
            tags: ["Users"],
            summary: "List all users (Admin only)",
            security: [{ ApiKeyAuth: [] }, { SessionAuth: [] }],
            responses: {
              200: {
                description: "List of users",
                content: {
                  "application/json": {
                    schema: { type: "array", items: { $ref: "#/components/schemas/User" } },
                  },
                },
              },
              403: { $ref: "#/components/responses/Forbidden" },
            },
          },
        },
      },
    },
  });
  return spec;
};
