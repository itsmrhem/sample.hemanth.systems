"use client";

import { useEffect, useState } from "react";
import crypto from "crypto";

declare global {
    interface Window {
        Razorpay: any;
    }
}

const paymentPage = () => {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Razorpay');
    const [email, setEmail] = useState('');

    useEffect(() => {
        fetch('/api/get-email')
            .then(response => response.json())
            .then(data => {
                if (data.email) {
                    setEmail(data.email);
                } else {
                    console.error('Failed to fetch email');
                }
            })
            .catch(error => console.error('Error fetching email:', error));
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => {
                console.log('Razorpay script loaded');
            };
            script.onerror = () => {
                console.error('Failed to load Razorpay script');
            };
            document.body.appendChild(script);
    }, []);

    const radios = [
        {
            name: "Razorpay",
            description: "1% convenience fee. 95% success rate. Live mode.",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#3a88fe" d="m22.436 0l-11.91 7.773l-1.174 4.276l6.625-4.297L11.65 24h4.391zM14.26 10.098L3.389 17.166L1.564 24h9.008z"/></svg>
    
        },
        {
            name: "PayU (beta)",
            description: "1.5% convenience fee. 95% success rate. Test mode.",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1em" viewBox="0 0 36 24"><path fill="#77bb41" d="M33.6 24H2.4A2.4 2.4 0 0 1 0 21.6V2.4A2.4 2.4 0 0 1 2.4 0h31.2A2.4 2.4 0 0 1 36 2.4v19.2a2.4 2.4 0 0 1-2.4 2.4m-15.159-6.408c-.33 1.04-.672 1.55-1.72 1.658c-.209.018-.344.047-.42.148a.48.48 0 0 0-.031.394l-.001-.003l.028.127c.062.294.166.48.497.48q.052.001.112-.006c1.536-.1 2.358-.926 2.84-2.854l1.642-6.576a.54.54 0 0 0-.029-.456l.001.003a.54.54 0 0 0-.435-.128h.003h-.129a.583.583 0 0 0-.688.54v.002l-1.185 4.927c-.149.606-.356.72-.711.72c-.436 0-.61-.104-.784-.72l-1.342-4.927a.6.6 0 0 0-.706-.538l.004-.001h-.114a.53.53 0 0 0-.432.131a.53.53 0 0 0-.012.46l-.001-.003l1.36 4.97c.254.951.56 1.739 1.687 1.739h.031q.288 0 .549-.084l-.013.004zm-6.938-4.32c-2.05 0-3.005.692-3.005 2.177c0 1.44.986 2.233 2.776 2.233c2.127 0 3.076-.724 3.076-2.348v-2.829c0-1.57-1.011-2.334-3.09-2.334h-.072a8 8 0 0 0-1.527.151l.049-.008c-.361.08-.512.176-.512.577v.114a.63.63 0 0 0 .074.346l-.002-.003a.31.31 0 0 0 .257.135l.023-.001h-.001a1 1 0 0 0 .225-.034l-.006.002c.46-.098.988-.154 1.529-.154h.021h-.001c1.264 0 1.78.35 1.78 1.209v.766zm12.005-5.178c-.855 0-1.213.132-1.213.95v4.983a3.7 3.7 0 0 0 .539 2.044l-.009-.016c.677 1.062 2 1.624 3.84 1.624s3.175-.56 3.852-1.624a3.67 3.67 0 0 0 .529-2.033v.006v-3.84h.995a.386.386 0 0 0 .386-.386V7.821a.386.386 0 0 0-.386-.386h-1.957a.387.387 0 0 0-.386.387v.273h-.142c-.855 0-1.213.132-1.213.95v4.983a1.37 1.37 0 0 1-.194.782l.004-.006c-.24.367-.709.539-1.481.541s-1.242-.174-1.481-.541a1.4 1.4 0 0 1-.192-.709l.002-.07v.003V9.04c0-.818-.358-.95-1.212-.95zm-20.274 0c-1.13-.003-1.634.501-1.634 1.63v7.255c0 .437.14.577.577.577h.143c.437 0 .577-.14.577-.577V14.16h2.45c2.176 0 3.19-.96 3.19-3.034S7.52 8.091 5.347 8.091zM32.72 5.39a.287.287 0 0 0-.287.286v1.472c0 .158.129.287.287.287h1.454a.286.286 0 0 0 .286-.286V5.68a.29.29 0 0 0-.287-.287zM31.245 4a.195.195 0 0 0-.195.195v.999c0 .108.087.195.194.195h.987a.195.195 0 0 0 .195-.195v-.999A.194.194 0 0 0 32.232 4zM11.259 16.57c-1.015 0-1.508-.367-1.508-1.12c0-.83.495-1.153 1.766-1.153h1.58v.995c-.001.808-.298 1.278-1.838 1.278m-5.912-3.623H2.896V9.896c0-.423.16-.58.58-.58h1.871c1.2 0 1.894.296 1.894 1.809c0 1.182-.302 1.822-1.894 1.822"/></svg>
    
        },
    ]
    const amount = 100;
    
    const [isProcessing, setIsProcessing] = useState(false);

    function generateHash(key: string, txnid: string, amount: string, productinfo: string, firstname: string) {
        // replace salt with env
        const input = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${process.env.NEXT_PUBLIC_PAYU_SALT}`;
        return crypto.createHash('sha512').update(input).digest('hex');
    }

    const handlePayUPayment = () => {
        console.log("PayU payment", process.env.PAYU_KEY);
        setIsProcessing(true);
        // replace key with env
        const key = process.env.NEXT_PUBLIC_PAYU_KEY!; 
        const txnid = "receipt_"+Math.random().toString(36).substring(7); 
        const productinfo = "Sample App"; 
        const amount = "100"; 
        const firstname = "Hemanth"; 
        const lastname = "Marupudi"; 
        const surl = "https://sample-hemanth-systems-3hkj.vercel.app/api/payment-success";
        const furl = "https://sample-hemanth-systems-3hkj.vercel.app/api/payment-failure";
        const phone = "9988776655"; 
        const hash = generateHash(key, txnid, amount, productinfo, firstname); 
        console.log(key, process.env.NEXT_PUBLIC_PAYU_SALT!);
        const form = document.createElement("form");
        form.action = "https://test.payu.in/_payment";
        form.method = "POST";
        
        
        
        const fields: { [key: string]: string } = {
            key,
            txnid,
            productinfo,
            amount,
            firstname,
            lastname,
            surl,
            furl,
            phone,
            hash
        };
    
        Object.keys(fields).forEach((field) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = field;
            input.value = fields[field];
            form.appendChild(input);
        });
    
        document.body.appendChild(form);
        form.submit();
    };
    
    const handlePayNowClick = () => {
        if (selectedPaymentMethod === 'Razorpay') {
            handlePayment();
        } else if (selectedPaymentMethod === 'PayU (beta)') {
            handlePayUPayment();
        }
    };
    

    const handlePayment = async () => {
        setIsProcessing(true);
        try {
            const response = await fetch("/api/order-init", {method: "POST"});
            const data = await response.json();
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: amount*100,
                currency: "INR",
                name: "Sample App",
                order_id: data.orderId,
                description: "Payment for Sample App",
                callback_url: "https://sample-hemanth-systems-3hkj.vercel.app/api/payment-success-rz",
                theme: {
                    color: "#3a88fe",
                },
            };
            console.log("Options: ", options);
            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch(error) {
            console.log("Error while creating rz order.(/route.ts)", error);
            console.log(error);
        } finally {
            setIsProcessing(false);
        }
    };
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <script src="https://checkout.razorpay.com/v1/checkout.js"/>
        <h1 className="text-lg sm:text-4xl font-bold text-center sm:text-left">Your total is 100₹. </h1>
        <div className="max-w-md mx-auto px-4">
            <h2 className="text-gray-800 font-medium">Select your payment gateway.</h2>
            <ul className="mt-6 space-y-3">
                {
                    radios.map((item, idx) => (
                        <li key={idx}>
                            <label htmlFor={item.name} className="block relative">
                                <input id={item.name} type="radio" defaultChecked={idx == 0 ? true : false} name="payment" className="sr-only peer" onChange={() => setSelectedPaymentMethod(item.name)}/>
                                <div className="w-full flex gap-x-3 items-start p-4 cursor-pointer rounded-lg border bg-white shadow-sm ring-indigo-600 peer-checked:ring-2 duration-200">
                                    <div className="flex-none">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h3 className="leading-none text-gray-800 font-medium pr-3">
                                            {item.name}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-600">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4 flex-none flex items-center justify-center w-4 h-4 rounded-full border peer-checked:bg-indigo-600 text-white peer-checked:text-white duration-200">
                                    <svg className="w-2.5 h-2.5" viewBox="0 0 12 10"><polyline fill="none" strokeWidth="2px" stroke="currentColor" strokeDasharray="16px" points="1.5 6 4.5 9 10.5 1"></polyline></svg>
                                </div>
                            </label>
                        </li>
                    ))
                }
                <h1>Refund will be initiated for payments made through live mode during working hours (7:00 - 19:00 IST) within 2.5 hours. It might take upto 10 hours to initiate refund for payments made through live mode during non-working hours.</h1>
                <button
                    onClick={handlePayNowClick}
                    className={`relative inline-block text-lg group ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isProcessing}
                >
                    <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-indigo-600 rounded-lg group-hover:text-white">
                        <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
                        <span className="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-indigo-600 group-hover:-rotate-180 ease"></span>
                        <span className="relative">Pay Now</span>
                    </span>
                <span className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-indigo-600 rounded-lg group-hover:mb-0 group-hover:mr-0" data-rounded="rounded-lg"></span>
                </button>
            </ul>
        </div>
    </div>
        
    );
};

export default paymentPage;