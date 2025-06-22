import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

// Use globalThis to persist Prisma instance during development
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prismaGlobal || prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prismaGlobal = prisma;
}

export default prisma;
