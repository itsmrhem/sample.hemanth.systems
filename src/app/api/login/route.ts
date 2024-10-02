import { NextRequest, NextResponse } from "next/server";
import { queryDatabase } from "@/app/service/database";
import { cookies } from "next/headers";
import requestIp from "request-ip";
import { CallTracker } from "assert";

const { EmailClient } = require("@azure/communication-email");

async function sendLoginEmail(ip: string, email: string) {
  const connectionString = process.env.AZURE_COMMUNICATION_EMAIL_CONNECTION_STRING;
  const client = new EmailClient(connectionString);
  const ipinfo = await fetch(`https://ipinfo.io/${ip}/json?token=${process.env.IPINFO_TOKEN}`);
  const ipinfoData = await ipinfo.json();
  console.log(ipinfoData);
  const from = "DoNotReply@sample.hemanth.systems";
    const to = email;
    console.log("Sending email to: ", to);
    const message = {
        senderAddress: from,
        content: {
            subject: "Login Alert",
            plainText: `Your account was logged into from ${ip} ${ipinfoData}`,
        },
        recipients: {
            to: [{address: to}],
        }
    };
    const poller = await client.beginSend(message);
    const result = await poller.pollUntilDone();
}

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  const ip = (request.headers.get('x-forwarded-for') ?? '152.59.194.253').split(',')[0]
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
    sendLoginEmail(ip, email);
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const cookieStore = cookies();
    cookieStore.set('session', token, { path: '/' });
    return NextResponse.json({ message: "Logged in" }, { status: 200 });
  }
  return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });

  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }
}