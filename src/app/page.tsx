import { Metadata } from "next";
import { PageClient } from "./page.client";

export const metadata: Metadata = {
  title: "Next.js Starter | Premium Application Template",
  description:
    "A powerful, modern application template built with Next.js 15, Prisma, and Tailwind 4. Ready for your next big project.",
};

export default function Home() {
  return <PageClient />;
}
