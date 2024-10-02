import { NextRequest, NextResponse } from "next/server";
import { queryDatabase } from "@/app/service/database";
import { cookies } from "next/headers";

import { EmailClient } from "@azure/communication-email";
import jwt from 'jsonwebtoken';



async function sendLoginEmail( email: string, ip: string) {
  const connectionString = process.env.AZURE_COMMUNICATION_EMAIL_CONNECTION_STRING;
  if (!connectionString) {
    throw new Error("Azure Communication Email connection string is not defined.");
  }
  const client = new EmailClient(connectionString);
  const from = "DoNotReply@sample.hemanth.systems";
    const to = email;
    console.log("Sending email to: ", to);
    const message = {
        senderAddress: from,
        content: {
            subject: "Login Alert",
            plainText: `Your account was logged into from ${ip}}`,
        },
        recipients: {
            to: [{address: to}],
        }
    };
    const poller = await client.beginSend(message);
    const finalize = await poller.pollUntilDone();
    console.log("Email result: ", finalize);
}

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  const ip = (request.headers.get('x-forwarded-for') ?? '152.59.194.253').split(',')[0];
  const city = (request.headers.get('x-vercel-ip-city') ?? 'Vijayawada');
  const country = (request.headers.get('x-vercel-ip-country') ?? 'India');
  const cookieStore = cookies();
  cookieStore.set('ip', ip, { path: '/' });
  cookieStore.set('city', city, { path: '/' });
  cookieStore.set('country', country, { path: '/' });
  console.log(ip)
  try { 
    const userResult = await queryDatabase(
    `SELECT * FROM credentials WHERE email = ?`,
    [email]
    );
    const user = JSON.parse(userResult);
  console.log("USSER", user);
  console.log("USER", user[0].email);
  console.log("USER", user[0].password);
  if (user[0].email === email && user[0].password === password) {
    sendLoginEmail(email, ip);
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT secret is not defined.");
    }
    const token = jwt.sign({ email }, jwtSecret, { expiresIn: '1h' });
    const cookieStore = cookies();
    cookieStore.set('session', token, { path: '/' });
    return NextResponse.json({ message: "Logged in" }, { status: 200 });
  }
  return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });

  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "User not found" }, { status: 401 });
  }
}