"use client";

import { useState } from "react";

import { useRouter } from 'next/navigation'


export default function Signup() {
    const [isProcessing, setIsProcessing] = useState(false);
    const router = useRouter();
    const [formData, setFormData] = useState({
      firstName: "",
      lastName: "",
      email: "",
      number: "",
      password: "",
      cpassword: "",
     });

     const [validationMessage, setValidationMessage] = useState('');
    const [passwordMatchMessage, setPasswordMatchMessage] = useState('');

      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };

      const validatePassword = (password: string) => {
        return password.length >= 8;
    };
     
      const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validatePassword(formData.password)) {
          setValidationMessage('Password must be at least 8 characters long.');
          return;
      }
      if (formData.password !== formData.cpassword) {
          setPasswordMatchMessage('Passwords do not match.');
          return;
      }
        setIsProcessing(true);
        try {
          const response = await fetch("/api/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });
          const data = await response.json();
          setValidationMessage('');
          setPasswordMatchMessage('');
          if (response.status === 200) {
            router.push('/verify-otp'); 
          }  else {
            alert(data.message);
          }
        } catch (error) {
          console.error("An unexpected error happened:", error);
          alert("Signup failed");
        } finally {
          setIsProcessing(false);
        }
      };

    return (
      <div className="max-w-4xl mx-auto font-[sans-serif] p-6">
      <div className="text-center mb-16">
        <h4 className="text-gray-800 text-3xl font-semibold mt-100">Sign up</h4>
        <h4 className="text-gray-800 text-base font-light">I understand how important your privacy is. Your number is NOT STORED in the database, it&apos;s only asked to test the functionality of the Whatsapp API. However, your email ID is STORED and will STRICTLY be used for transactional purposes only. Any data you share will be deleted within 12 hours after sending a request to root@hemanth.systems.</h4>
      </div>

      <form onSubmit={handleSubmit} method="POST">
        <div className="grid sm:grid-cols-2 gap-8">
          <div>
              <label htmlFor="name" className="block text-full font-bold leading-6 text-black">
                First Name
              </label>
                <input
                  onChange={handleChange}
                  id="firstName"
                  name="firstName"
                  type="name"
                  required
                  autoComplete="first-name"
                  className="block w-full rounded-md border-1 py-2 px-2.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                />
          </div>
          <div>
            {/* <label className="text-gray-800 text-sm mb-2 block">Last Name</label> */}
            {/* <input name="lname" type="text" className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all" placeholder="Enter last name" /> */}
            <label htmlFor="name" className="block text-full font-bold leading-6 text-black">
                Last Name
              </label>
                <input
                  onChange={handleChange}
                  id="lastName"
                  name="lastName"
                  type="name"
                  required
                  autoComplete="last-name"
                  className="block w-full rounded-md border-1 py-2 px-2.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                />
          </div>
          <div>
            {/* <label className="text-gray-800 text-sm mb-2 block">Email Id</label> */}
            {/* <input name="email" type="text" className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all" placeholder="Enter email" /> */}
            <label htmlFor="email" className="block text-full font-bold leading-6 text-black">
                Email address
              </label>
                <input
                  onChange={handleChange}
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md border-1 py-2 px-2.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                />
          </div>
          <div>
            {/* <label className="text-gray-800 text-sm mb-2 block">Mobile No.</label> */}
            {/* <input name="number" type="number" className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all" placeholder="Enter mobile number" /> */}
            <label htmlFor="number" className="block text-full font-bold leading-6 text-black">
                Mobile No. with Country Code
              </label>
                <input
                  onChange={handleChange}
                  id="number"
                  name="number"
                  type="tel"
                  required
                  autoComplete="number"
                  className="block w-full rounded-md border-1 py-2 px-2.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                />
          </div>
          <div>
            {/* <label className="text-gray-800 text-sm mb-2 block">Password</label> */}
            {/* <input name="password" type="password" className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all" placeholder="Enter password" /> */}
            <label htmlFor="password" className="block text-full font-bold leading-6 text-black">
                Password
              </label>
                <input
                  onChange={handleChange}
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="password"
                  className="block w-full rounded-md border-1 py-2 px-2.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                />
          </div>
          <div>
            {/* <label className="text-gray-800 text-sm mb-2 block">Confirm Password</label> */}
            {/* <input name="cpassword" type="password" className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all" placeholder="Enter confirm password" /> */}
            <label htmlFor="cpassword" className="block text-full font-bold leading-6 text-black">
                Confirm Password
              </label>
                <input
                  onChange={handleChange}
                  id="cpassword"
                  name="cpassword"
                  type="password"
                  required
                  autoComplete="cpassword"
                  className="block w-full rounded-md border-1 py-2 px-2.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                />
          </div>
          {validationMessage && <p className="text-red-500">{validationMessage}</p>}
                {passwordMatchMessage && <p className="text-red-500">{passwordMatchMessage}</p>}
        </div>

        <div className="!mt-12">
        <button
                    type="submit"
                    className={`mt-6 px-4 py-2 font-bold text-white bg-blue-500 rounded ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isProcessing}
                >
                    {isProcessing ? 'Processing...' : 'Sign Up'}
                </button>
        </div>
      </form>
    </div>
    );
  }
  