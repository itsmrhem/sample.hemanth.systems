"server only"
import { NextResponse } from 'next/server'
import { createUser, getUserByEmail } from "../../../../../lib/prisma";

export async function POST(req: Request) {
  console.log("credentials provider signup started")
  try {
    const { name, email, password } = await req.json()
    console.log(name, email, password)
    console.log("checking if user already exists cred provider")
    const existingUser = await getUserByEmail(email)
    if (existingUser != null) {
      console.log("User already exists cred provider")
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }
    console.log("user does not exist cred provider")  
    const user = {
      name: name,
      email: email,
      password: password,
      isCredential: true,
      isVerified: true //SECURITY FLAW: Using true for testing purpose. only set this to true post email verification
    }
    //todo email verification
    console.log("Creating user cred provider")
    await createUser(user)
    return NextResponse.json({ message: 'User created successfully' }, { status: 200 }) 
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Error creating user' }, { status: 500 })
  }
}