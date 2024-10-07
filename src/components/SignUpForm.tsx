"use client"

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from "next/navigation"

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')
})

export default function SignupPage() {
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<z.ZodIssue[]>([])
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])

    try {
      schema.parse({ email, password })
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
        
      })
      if (response.status === 200) {
        router.push('/signin1') 
      } else {
        console.log(response)
        console.error('Sign up failed')
      }
      console.log('Signup with:', { email, password })
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.issues)
      }
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Sign Up</h2>
        <p className="text-center text-gray-600 mb-8">Create your account to get started</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <AnimatePresence>
              {errors.map((error, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-red-500 text-sm mt-1 flex items-center space-x-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{error.message}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center space-x-2">
          <hr className="w-full border-t border-gray-300" />
          <span className="bg-white px-4 text-gray-500 text-sm">or</span>
          <hr className="w-full border-t border-gray-300" />
        </div>

        <div className="mt-6 space-y-4">
          <button
            type="button"
            onClick={() => signIn('google', { callbackUrl: "/pay1"})}
            className="w-full py-3 px-4 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4285F4] transition-all duration-300 ease-in-out flex items-center justify-center space-x-2 border border-gray-300"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Continue with Google</span>
          </button>
          <button
            type="button"
            onClick={() => signIn('twitter', { callbackUrl: "/pay1"})}
            className="w-full py-3 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-[#1DA1F2] hover:bg-[#1a91da] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1DA1F2] transition-all duration-300 ease-in-out flex items-center justify-center space-x-2"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 5.8a8.49 8.49 0 0 1-2.36.64 4.13 4.13 0 0 0 1.81-2.27 8.21 8.21 0 0 1-2.61 1 4.1 4.1 0 0 0-7 3.74 11.64 11.64 0 0 1-8.45-4.29 4.16 4.16 0 0 0-.55 2.07 4.09 4.09 0 0 0 1.82 3.41 4.05 4.05 0 0 1-1.86-.51v.05a4.1 4.1 0 0 0 3.3 4 4.1 4.1 0 0 1-1.86.07 4.11 4.11 0 0 0 3.83 2.84A8.22 8.22 0 0 1 3 18.34a11.57 11.57 0 0 0 6.29 1.85A11.59 11.59 0 0 0 21 8.45v-.53a8.43 8.43 0 0 0 2-2.12Z" />
            </svg>
            <span>Continue with Twitter</span>
          </button>
        </div>
      </div>
    </div>
  )
}