import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

let prisma;

if (process.env.DATABASE_HOST && process.env.DATABASE_USER && process.env.DATABASE_PASSWORD && process.env.DATABASE_NAME) {
    const adapter = new PrismaMariaDb({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        connectionLimit: 5,
    });
    prisma = new PrismaClient({ adapter });
    console.log("Prisma initialized with MariaDB adapter");
} else {
    // Fallback to standard PrismaClient using DATABASE_URL from schema/env
    prisma = new PrismaClient();
    console.log("Prisma initialized with standard client (DATABASE_URL)");
}

export { prisma };