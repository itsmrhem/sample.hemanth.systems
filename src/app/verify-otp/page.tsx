"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function Otpverify() {
    const router = useRouter();
    const [otp, setOtp] = useState('');

    useEffect(() => {
        const verificationCookie = Cookies.get('verification');
        if (!verificationCookie) {
            router.push('/forbidden');
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (otp.length !== 6) { 
            alert('Invalid OTP. OTP is a 6 digit number');
            return;
        }
        try {
            const response = await fetch('/api/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "otp": otp }),
            });
            const data = await response.json();
            console.log(data);
            if (response.status === 200) {
                router.push('/login'); 
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert('An error occurred');
        }
    };

    

    return (
        <div className="max-w-md mx-auto border max-w-sm mt-20 rounded">
            <h1 className="text-center text-2xl font-bold p-4">Verify OTP</h1>
            <p className="text-center text-sm text-gray-600 p-4">OTP has been sent to your email and whatsapp</p>

    <form onSubmit={handleSubmit} className="shadow-md px-4 py-6">
        <div className="flex justify-center gap-2 mb-6">



            <input value={otp} onChange={(e) => setOtp(e.target.value)}      className="w-40 h-12 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500" type="text" inputMode="numeric"  required/>
        </div>
        <div className="flex items-center justify-center">
            <button className="bg-indigo-600 hover:bg-indigo-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                Verify
            </button>
            <a className="inline-block align-baseline font-bold text-sm text-indigo-600 hover:text-indigo-500 ml-4" href="#">
                Resend OTP
            </a>
        </div>
    </form>
</div>
    );
}