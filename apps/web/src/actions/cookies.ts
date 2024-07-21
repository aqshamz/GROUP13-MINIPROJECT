"use server"

import { cookies } from "next/headers"

export async function setCookies(cookieName: string, value: any) {
    cookies().set(cookieName, value)
}

export async function getCookie(cookieName: string) {
    const cookie = cookies().get(cookieName);
    const value = cookie?.value;
    console.log(`Getting cookie: ${cookieName} = ${value}`);
    return value;
}

export async function deleteCookie(cookieName: string) {
    return await cookies().delete(cookieName)
}