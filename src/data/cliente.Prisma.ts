import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.ts';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
	throw new Error('A variável de ambiente DATABASE_URL não foi definida.');
}

const adapter = new PrismaPg({
	connectionString: databaseUrl,
});

export const prisma = new PrismaClient({
	adapter,
});
