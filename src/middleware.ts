// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'
export { default } from "next-auth/middleware"

// export async function middleware(request: NextRequest) {
//   const token = request.cookies.get('session')?.value
    
//   if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup') {
//     if (token) {
//         return NextResponse.redirect(new URL('/pay', request.url))
//     }
//   } else if (request.nextUrl.pathname === '/pay') {
//     if (!token) {
//       return NextResponse.redirect(new URL('/login', request.url))
//     }
//   } 
//   return NextResponse.next()
// }

export const config = {
  matcher: ['/login', '/pay1', '/signup', '/pay'],
}