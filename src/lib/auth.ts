import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authConfig } from "@/auth.config";
import { USER_STATUS, AUTH_ROLES } from "@/features/auth/constants";
import { CaptchaService } from "@/features/auth/services/captcha.service";
import { headers } from "next/headers";

class InvalidCaptchaError extends CredentialsSignin {
  code = "InvalidCaptcha";
}

class GoogleAuthDisabledError extends CredentialsSignin {
  code = "GoogleAuthDisabled";
}


export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        captchaToken: { label: "Captcha Token", type: "text" },
        captchaAnswer: { label: "Captcha Answer", type: "text" },
      },
      authorize: async (credentials) => {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          
          const reqHeaders = await headers();
          const forwardedFor = reqHeaders.get("x-forwarded-for");
          const ipAddress = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown";

          const requiresCaptcha = await CaptchaService.requiresCaptcha(ipAddress);

          if (requiresCaptcha) {
            const captchaToken = credentials?.captchaToken as string;
            const captchaAnswer = credentials?.captchaAnswer as string;

            if (!CaptchaService.verifyChallenge(captchaToken, captchaAnswer)) {
              await CaptchaService.recordFailedAttempt(ipAddress, email);
              throw new InvalidCaptchaError();
            }
          }

          const user = await prisma.user.findUnique({ where: { email } });
          if (!user) {
            await CaptchaService.recordFailedAttempt(ipAddress, email);
            return null;
          }

          // Password check (if user was registered via OAuth, password will be null)
          if (!user.password) {
            await CaptchaService.recordFailedAttempt(ipAddress, email);
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);
          
          if (!passwordsMatch) {
            await CaptchaService.recordFailedAttempt(ipAddress, email);
            return null;
          }

          // STATUS CHECK: Only ACTIVE users or SUPERADMIN can login
          const isSuperAdmin = user.role === AUTH_ROLES.SUPERADMIN;
          const isActive = user.status === USER_STATUS.ACTIVE;

          if (!isActive && !isSuperAdmin) {
            // Throwing a custom message here might require manual handling in login page
            // For now, we return null to prevent sign-in
            return null;
          }
          
          // Clear attempts on successful sign-in
          await CaptchaService.clearAttempts(ipAddress);

          return user;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ account }) {
      if (account?.provider === "google") {
        // Enforce system setting
        const systemConfig = await prisma.systemConfig.findUnique({
          where: { id: "default" },
        });

        if (systemConfig && !systemConfig.enableGoogleAuth) {
          throw new GoogleAuthDisabledError(); // Fails sign in with specific error
        }
      }
      return true;
    }
  },
  secret: process.env.AUTH_SECRET || "secret",
});
