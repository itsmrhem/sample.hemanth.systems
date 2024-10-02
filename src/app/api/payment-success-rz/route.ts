import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
const { EmailClient } = require("@azure/communication-email");
import Razorpay from "razorpay";


async function sendEmail(email: string, subject: string, body: string) {
  const connectionString = process.env.AZURE_COMMUNICATION_EMAIL_CONNECTION_STRING;
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
        var jwt = require('jsonwebtoken');
        var decoded = jwt.verify(jwtToken?.value, process.env.JWT_SECRET);
        const email = decoded.email;
        console.log('Email:', email);
        const body = `Thank you for your payment of 100 for ${payment.description}. Your payment reference number is ${payment.id}. Order ID: ${payment.order_id}. Payment method: ${payment.method}.UPI ID: ${payment.vpa}. Your payment gateway is razorpay.`;
        sendEmail(email, 'Payment Success', body);
        return NextResponse.redirect(new URL('/thank-you', request.url), 303);
    } catch (error) {
        console.error('Error processing payment response:', error);
        return NextResponse.redirect(new URL('/pay', request.url), 303);
    }
}

export async function GET(request: NextRequest) {
    return NextResponse.redirect(new URL('/thank-you', request.url));
}
