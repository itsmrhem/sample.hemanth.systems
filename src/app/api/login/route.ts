import { NextRequest, NextResponse } from "next/server";
import { queryDatabase } from "@/app/service/database";
import { cookies } from "next/headers";
import IPinfoWrapper from "node-ipinfo";

import { EmailClient } from "@azure/communication-email";
import jwt from 'jsonwebtoken';

async function sendTestLoginEamil(email: string, ip: string) {
  console.log("starting to send email")
  const connectionString = process.env.AZURE_COMMUNICATION_EMAIL_CONNECTION_STRING;
  if (!connectionString) {
    throw new Error("Azure Communication Email connection string is not defined.");
  }
  
  let body = "Your account was logged into from the IP address " + ip + ". Go to https://ipinfo.io/" + ip + " to see more details of the IP address.";
  try {
    const ipinfoToken = process.env.IPINFO_TOKEN;
    if (!ipinfoToken) {
      throw new Error("IPinfo token is not defined.");
    }
    const ipinfoWrapper = new IPinfoWrapper(ipinfoToken);
    const ipinfo = await ipinfoWrapper.lookupIp(ip);
    console.log("IP info: ", ipinfo);
    const city = ipinfo.city;
    const country = ipinfo.country;
    const org = ipinfo.org;
    const loc = ipinfo.loc;
    console.log("City: ", city);
    console.log("Country: ", country);
    body = `Your account was logged in from the IP 
    address ${ip} in ${city}, ${country}. ISP is ${org}. Coordinates ${loc}. Your IP and location info are NOT STORED they are only used for your info.`;

  } catch (e) {
    console.error(e);
  }
  const client = new EmailClient(connectionString);
    const to = email;
    console.log("Sending email to: ", to);
    const message = {
        senderAddress: "DoNotReply@sample.hemanth.systems",
        content: {
            subject: "Login Alert",
            plainText: body,
        },
        recipients: {
            to: [{address: to}],
        }
    };

    await client.beginSend(message);
    console.log("Login Email sent")
}

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  // using dummy ip for testing to see the working of ipinfo api for prod use vercel headers to et the ip 
  const ip = (request.headers.get('x-forwarded-for') ?? '152.59.194.253').split(',')[0];
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
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT secret is not defined.");
    }
    const token = jwt.sign({ email }, jwtSecret, { expiresIn: '1h' });
    const cookieStore = cookies();
    cookieStore.set('session', token, { path: '/' });
    console.log("sending email")
    await sendTestLoginEamil(email, ip);
    return NextResponse.json({ message: "Logged in" }, { status: 200 });
  }
  return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });

  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "User not found" }, { status: 401 });
  }
}