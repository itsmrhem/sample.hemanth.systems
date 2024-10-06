import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Twitter from "next-auth/providers/twitter";
import CredentialsProvider from "next-auth/providers/credentials";
import { createUser, getUserByEmail } from "../../../../../lib/prisma";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Twitter({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
      version: "2.0",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("credentials provider authorize")
        const user = await getUserByEmail(credentials.email);
        console.log("user", user)
        if (user) {
          console.log("user found")
          if (user.password === credentials.password) {
            console.log("password match")
            return user;
          } else {
            console.log("password mismatch")
            return null;
          }
        } else {
          console.log("no user")
          return false;
        }
      }

    })
  ],
  pages: {
    signIn: "/signin1",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
      }
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },

    async signIn({ user, account, profile, email, credentials }) {
      console.log("Sign In callback")
      console.log("signIn", { user, account, profile, email, credentials })
      console.log(account.provider)
      console.log(user.email)
      console.log(user.name)
      if (account.provider == "google") {
        console.log("Google provider used")
        console.log("Checking if user exists already.")
        const existingUser = await getUserByEmail(user.email);
        if (existingUser == null) {
          console.log("ggl user does not exists. creating user")
          const newUser = {
            email: user.email,
            name: user.name,
            isGoogle: true,
            isVerified: true
          }
          try {
            console.log("ggl usr create trying")
            await createUser(newUser);
            console.log("Google User created")
          } catch (error) {
            console.log("Error creating Google User")
            console.log(error)
            return false
          }
          //todo: send welcome email for ggl user here
        } 
        else {
          console.log("ggl user exists")
          //todo: send login alert email here
        }
      } else if (account.provider == "twitter") {
        console.log("twit user")
        return true
      }
      return true
    },
    async session({ session, token }) {
      console.log("Session callback")
      session.user.id = token.id
      return session
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },
});

export { handler as GET, handler as POST };
