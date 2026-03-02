import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email) {
    console.error("Please provide email. Usage: bun scripts/setup-admin.ts <email> [password]");
    process.exit(1);
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log(`User ${email} found. Promoting to SUPERADMIN...`);
    await prisma.user.update({
      where: { email },
      data: { role: "SUPERADMIN" },
    });
    console.log("User promoted successfully!");
  } else {
    if (!password) {
      console.error(
        "Password required for new user. Usage: bun scripts/setup-admin.ts <email> <password>"
      );
      process.exit(1);
    }

    console.log(`Creating new SUPERADMIN user ${email}...`);
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        name: "Super Admin",
        password: hashedPassword,
        role: "SUPERADMIN",
      },
    });
    console.log("Super Admin created successfully!");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
