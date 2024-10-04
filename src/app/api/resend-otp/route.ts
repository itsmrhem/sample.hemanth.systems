import {  NextResponse } from "next/server";
import { queryDatabase } from "@/app/service/database";
import { EmailClient } from "@azure/communication-email";
import jwt from 'jsonwebtoken';
import { cookies } from "next/headers";

async function resendOtp(email: string, otp: string) {
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
            subject: "Resend OTP",
            plainText: "Your OTP is " + otp,
        },
        recipients: {
            to: [{address: to}],
        }
    };
    const bs = await client.beginSend(message);
    await bs.pollUntilDone();
    console.log("Resend OTP Email sent")
}

export async function POST() {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT secret is not defined.");
      }
    const cookieStore = cookies();
    const jwtToken = cookieStore.get("verification");
    if (!jwtToken) {
        throw new Error("JWT token is not defined. Forbidden. ");
    }
    const decoded = jwt.verify(jwtToken.value, jwtSecret) as jwt.JwtPayload;
    console.log(jwtToken);
    console.log(decoded);
    const email = decoded.email;
    try {
    const query = "SELECT * FROM credentials WHERE email = ?";
    const resultString = await queryDatabase(query, [email]);
    const result = JSON.parse(resultString);
    console.log('Query result:', result);
    const otp = result[0].otp;
    console.log("OTP from the database: ", otp);
    await resendOtp(email, otp);
    return NextResponse.json({ message: "OTP resent" }, { status: 200 });
    } catch (error) {
        console.log("Error:", error);
        return NextResponse.json({ message: "Server error. Notified. On It." }, { status: 500 });
    }
}

