import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default prisma;

interface User {
    name: string;
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
    console.log(user);
        return await prisma.credentials1.create({
            data: {
                name: user.name, 
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


export async function updateUserByEmail(email: string, user: Partial<User>) {
    const data: Partial<User> = {};
    if (user.name !== undefined) data.name = user.name;
    if (user.isVerified !== undefined) data.isVerified = user.isVerified;
    if (user.isCredential !== undefined) data.isCredential = user.isCredential;
    if (user.isGoogle !== undefined) data.isGoogle = user.isGoogle;
    if (user.isTwitter !== undefined) data.isTwitter = user.isTwitter;
    if (user.twitterAccountID !== undefined) data.twitterAccountID = user.twitterAccountID;
    if (user.password !== undefined) data.password = user.password;
    if (user.otp !== undefined) data.otp = user.otp;
  
    return await prisma.credentials1.update({
      where: { email: email },
      data: data,
    })
}
