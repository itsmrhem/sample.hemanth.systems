import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { EmailClient } from '@azure/communication-email';
import jwt from 'jsonwebtoken';
import Razorpay from "razorpay";


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
  const poller = await client.beginSend(message);
  const result = await poller.pollUntilDone();
  console.log("Email result: ", result);
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        console.log('Form Data:', formData);
        const paymentData = {
            razorpay_payment_id: formData.get('razorpay_payment_id'),
            razorpay_order_id: formData.get('razorpay_order_id'),
            razorpay_signature: formData.get('razorpay_signature'),
        };
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        })
        
        const payment = await razorpay.payments.fetch(paymentData.razorpay_payment_id as string);
        console.log('Payment:', payment);
        if (payment.status !== 'captured') {
            console.error('Payment not captured:', payment);
            return NextResponse.redirect(new URL('/pay', request.url), 303);
        }
        const cookieStore = cookies();
        const jwtToken = cookieStore.get("session");
        if (!jwtToken) {
            throw new Error("JWT token is not defined.");
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error("JWT secret is not defined.");
        }
         const decoded = jwt.verify(jwtToken?.value, jwtSecret) as jwt.JwtPayload;
        const email = (decoded as jwt.JwtPayload).email;
        console.log('Email:', email);
        const body = `Thank you for your payment of 100 for ${payment.description}. Your payment reference number is ${payment.id}. Order ID: ${payment.order_id}. Payment method: ${payment.method}.UPI ID: ${payment.vpa}. Your payment gateway is razorpay.`;
        await sendEmail(email, 'Payment Success', body);
        return NextResponse.redirect(new URL('/thank-you', request.url), 303);
    } catch (error) {
        console.error('Error processing payment response:', error);
        return NextResponse.redirect(new URL('/pay', request.url), 303);
    }
}

export async function GET(request: NextRequest) {
    return NextResponse.redirect(new URL('/thank-you', request.url));
}
