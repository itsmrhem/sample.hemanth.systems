import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default prisma;

interface User {
    name?: string;
    email: string;
    isVerified?: boolean;
    isCredential?: boolean;
    isGoogle?: boolean;
    isTwitter?: boolean;
    twitterAccountID?: string;
    password?: string;
    otp?: string;
  }

export async function createUser(user: User) { 
        return await prisma.credentials1.create({
            data: {
                name: user.name , 
                email: user.email,
                isVerified: user.isVerified ?? false, 
                isCredential: user.isCredential ?? false,
                isGoogle: user.isGoogle ?? false, 
                isTwitter: user.isTwitter ?? false,
                twitterAccountID: user.twitterAccountID ?? null, 
                password: user.password ?? null, 
                otp: user.otp ?? null, 
              },
        });
}

export async function getUserByEmail(email: string) {
    return await prisma.credentials1.findUnique({
        where: { email: email },
    });
}

