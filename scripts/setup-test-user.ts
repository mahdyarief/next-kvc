import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const email = "test@api.com";
  const apiKey = "ntk_TESTAPIKEY123";
  const password = await bcrypt.hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { apiKey, role: "SUPERADMIN" },
    create: {
      email,
      password,
      name: "Test User",
      apiKey,
      role: "SUPERADMIN",
    },
  });

  console.log(`User ${user.email} ready with API Key: ${user.apiKey}`);
}


main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
