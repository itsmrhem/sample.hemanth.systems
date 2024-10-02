import { NextRequest, NextResponse } from "next/server";

import {cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { queryDatabase } from "@/app/service/database";


export async function POST(request: NextRequest) {
    const body = await request.json();
    const { otp } = body;
    const cookieStore = cookies();
    if (!cookieStore.has("verification")) {
        console.log("No JWT token found");
        return NextResponse.json({ message: "Forbidden"}, {status: 403 });
    }
    console.log("JWT token found");
    const jwtToken = cookieStore.get("verification");
    console.log(jwtToken);

    if (!jwtToken?.value) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
    const decoded = jwt.verify(jwtToken.value, secret) as jwt.JwtPayload;
    console.log(decoded);
    
    const email = decoded.email;
    const query = "SELECT * FROM credentials WHERE email = ?";
    const resultString = await queryDatabase(query, [email]);
    const result = JSON.parse(resultString);
    console.log('Query result:', result);
    console.log('Result type:', typeof result);
    console.log('Is array:', Array.isArray(result));
    console.log('Result length:', result.length);
    console.log('Result content:', JSON.stringify(result, null, 2));

    console.log(result);
    if (result.length > 0) {
        console.log("Email from the token is found in the database")
        const user = result[0];
        console.log("user", user.otp);
        console.log("otp", otp);
        if (user.otp === otp && user.isVerified === 0) {
            const updateQuery = "UPDATE credentials SET isVerified = 1 WHERE email = ?";
            const updateResult = await queryDatabase(updateQuery, [email]);
            console.log(updateResult);
            console.log("OTP verified");
            cookies().delete("verification");
            return NextResponse.json({ message: "OTP verified"}, {status: 200 });
        } else if (user.isVerified === 1) {
            console.log("User already verified");
            return NextResponse.json({ message: "User already verified"}, {status: 400 });
        } else {
            console.log("Incorrect OTP");
            return NextResponse.json({ message: "Incorrect OTP"}, {status: 400 });
        }
    } else {
        console.log("Email not found in the database");
        return NextResponse.json({ message: "Email not found"}, {status: 400 });
    }

}