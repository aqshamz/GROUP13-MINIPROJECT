"use server"
import { NextRequest, NextResponse } from 'next/server'
import * as jose from 'jose'
import * as jwt from 'jsonwebtoken'
// import { decrypt } from '@/app/lib/session'
import { cookies } from 'next/headers'

const protectedRoutes = ['/event']
const publicRoutes = ['/login', '/register']

export default async function middleware(req: NextRequest) {
    try {
        const path = req.nextUrl.pathname
        const isProtectedRoute = protectedRoutes.includes(path)
        const isPublicRoute = publicRoutes.includes(path)

        const authToken = cookies().get('authToken')?.value as any

        let session = null
        if (authToken) {
            session = await jwt.verify(authToken, "mySecretKey")
        }

        if (isProtectedRoute && !session) {
            return NextResponse.redirect(new URL('/login', req.nextUrl))
        }

        return NextResponse.next()
    } catch (err) {

        return NextResponse.next()

    }

}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}