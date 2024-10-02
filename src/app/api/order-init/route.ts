import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: NextRequest) {
    try { 
        const order = await razorpay.orders.create({
            amount: 100 * 100, 
            currency: "INR",
            receipt: "receipt_"+Math.random().toString(36).substring(7),
    });
    console.log("Order created: ", order);
    return NextResponse.json({orderId: order.id}, {status: 200});   
    } catch(error) { 
        console.error(error);
        return NextResponse.json({message: "Error while creating rz order.(/route.ts)", status_code: 500});
    }
}