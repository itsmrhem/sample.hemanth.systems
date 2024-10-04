import axios from "axios";

import { NextRequest, NextResponse } from "next/server";

import { queryDatabase } from "@/app/service/database";
import { cookies } from "next/headers";

import { EmailClient } from "@azure/communication-email";
import jwt from 'jsonwebtoken';

async function sendEmail(email: string, subject: string, body: string) {
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
            subject: subject,
            plainText: body,
        },
        recipients: {
            to: [{address: to}],
        }
    };
    client.beginSend(message);
    // const result = poller.pollUntilDone();
    // console.log("Email result: ", result);
}

async function sendWhatsapp(number: string, otp: string) {
    const auth = process.env.INFOBIP_AUTHORIZATION;
    console.log(auth);
    const settings = {
        "url": "https://ejnrrn.api.infobip.com/whatsapp/1/message/template",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Authorization": auth,
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        "data": JSON.stringify({
            "messages": [
                {
                    "from": "12366137019",
                    "to":  number,
                    "content": {
                        "templateName": "otp_sending",
                        "templateData": {
                            "body": {
                                "placeholders": [
                                    otp,
                                    "Sample Next App"
                                ]
                            },
                            "buttons": [
            {"type":"QUICK_REPLY", "parameter":"I Consent"}
          ]
                        },
                        "language": "en"
                    },
                }
            ]
        }),
    };
    try {
        const response = await axios(settings);
        console.log(response.data);
    }
    catch (error) {
        console.error(error);
    }
    
}

    async function isEmailRegistered(email: string): Promise<boolean> {
    try {
        const query = "SELECT * FROM credentials WHERE email = ?";
        const resultUnparsed = await queryDatabase(query, [email]);
        const result = JSON.parse(resultUnparsed);
        if (result[0].email === email) {
            return true;
        }
        return false;
    } catch (error) {
        console.error(error);
        return false;
    }
    
}

async function dbInteraction(email: string, firstName: string, lastName: string, password: string, otp: string) {
    const query = "INSERT INTO credentials (email, first_name, last_name, password, otp) VALUES (?, ?,  ?, ?, ?)";
    const result = await queryDatabase(query, [email, firstName, lastName, password, otp]);
    console.log(result);
} 

export async function POST(request: NextRequest) {
    const body = await request.json();
    console.log(body);
    const email = body.email;
    const isRegistered = await isEmailRegistered(email);
    if (isRegistered) {
        console.log("email already registered");
        return NextResponse.json({ message: "Bruhhh."}, {status: 400 });
    } else {
        const firstName = body.firstName;
        const lastName = body.lastName;
        const otp = Math.floor(100000 + Math.random() * 900000);
        sendEmail(email, String(otp), `Hello ${firstName} ${lastName}, Welcome to Sample App!`);
        sendWhatsapp(body.number, String(otp));
        await dbInteraction(email, firstName, lastName, body.password, String(otp));
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error("JWT secret is not defined.");
        }
        const token = jwt.sign({ email: email }, jwtSecret);
        console.log(token);
        cookies().set('verification', token);
        return NextResponse.json({ message: "Signup successful"}, {status: 200 });
    }
}
