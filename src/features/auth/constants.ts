import { z } from "zod";

/**
 * Register Schema with strong password validation
 */
export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const registerFormSchema = registerSchema
  .extend({
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });

export type RegisterFormInput = z.infer<typeof registerFormSchema>;

export const USER_STATUS = {
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
} as const;

export type UserStatus = keyof typeof USER_STATUS;

export const RECOVERY_CONFIG = {
  CODE_COUNT: 8,
  CODE_LENGTH: 12,
  CHALLENGE_INDEX: 4, // 0-indexed, usually we ask for the 4th/5th code
} as const;

export const forgetPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  recoveryCode: z.string().min(1, "Recovery code is required"),
  codeIndex: z.number().int().min(0).max(RECOVERY_CONFIG.CODE_COUNT - 1),
  password: registerSchema.shape.password,
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).superRefine(({ confirmPassword, password }, ctx) => {
  if (confirmPassword !== password) {
    ctx.addIssue({
      code: "custom",
      message: "The passwords did not match",
      path: ["confirmPassword"],
    });
  }
});

export type ForgetPasswordInput = z.infer<typeof forgetPasswordSchema>;

export const AUTH_ROLES = {
  SUPERADMIN: "SUPERADMIN",
  ADMIN: "ADMIN",
  STAFF: "STAFF",
  CUSTOMER: "CUSTOMER",
} as const;

export type AuthRole = keyof typeof AUTH_ROLES;
