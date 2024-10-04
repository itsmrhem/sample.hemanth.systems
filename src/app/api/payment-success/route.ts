import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { EmailClient } from '@azure/communication-email';
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
  await client.beginSend(message);
  console.log("payu payment email sent")
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const paymentData = {
            mihpayid: formData.get('mihpayid'),
            status: formData.get('status'),
            txnid: formData.get('txnid'),
            amount: parseFloat(formData.get('amount') as string), 
            productinfo: formData.get('productinfo'),
            firstname: formData.get('firstname'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            bank_ref_num: formData.get('bank_ref_num'),
            error: formData.get('error'),
            errorMessage: formData.get('error_Message'),
            payment_source: formData.get('payment_source'),
            cardnum: formData.get('cardnum'),
        };

        console.log(paymentData); 
        if (paymentData.status !== 'success') {
           alert('Payment failed. Please try again.');
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
        const decoded = jwt.verify(jwtToken.value, jwtSecret);
        let email: string;
        if (typeof decoded !== 'string' && 'email' in decoded) {
            email = decoded.email as string;
        } else {
            throw new Error("Decoded token does not contain an email.");
        }
        console.log('Email:', email);
        const body = `Thank you for your payment of ${paymentData.amount} for ${paymentData.productinfo}. Your payment reference number is ${paymentData.txnid}. Bank refernce number is ${paymentData.bank_ref_num}. Your payment gateway is ${paymentData.payment_source}.`;
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
