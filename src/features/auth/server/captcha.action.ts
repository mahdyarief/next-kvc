"use server";

import { headers } from "next/headers";
import { CaptchaService } from "../services/captcha.service";

/**
 * Checks if the current IP requires a captcha, and generates one if needed.
 */
export async function checkCaptchaRequirement() {
  const reqHeaders = await headers();
  // Vercel/Next.js uses x-forwarded-for for the client IP
  const forwardedFor = reqHeaders.get("x-forwarded-for");
  const ipAddress = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown";
  
  const requiresCaptcha = await CaptchaService.requiresCaptcha(ipAddress);
  
  if (requiresCaptcha) {
    const challenge = CaptchaService.generateChallenge();
    return {
      required: true,
      question: challenge.question,
      token: challenge.id,
    };
  }
  
  return { required: false };
}
