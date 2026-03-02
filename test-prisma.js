const { prisma } = require("./src/lib/prisma");

process.env.DATABASE_URL = "file:./prisma/local.db";

async function main() {
    console.log("Testing Prisma connection...");
    try {
        const userCount = await prisma.user.count();
        console.log(`Connection successful! User count: ${userCount}`);
    } catch (e) {
        console.error("Connection FAILED:");
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
