"server-only"
import { NextResponse } from "next/server";
import Razorpay from "razorpay";



export async function POST() {
    const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;
console.log("Key ID: ", keyId);
console.log("Key Secret: ", keySecret);
if (!keyId || !keySecret) {
    throw new Error("RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set");
}

const razorpay = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
});

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