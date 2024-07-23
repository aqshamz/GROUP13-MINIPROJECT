"use server"
import { getCookie } from "./cookies"
import jose from "jose"
export async function checkToken() {
    const authToken = await getCookie("authToken")
    try {
        if (authToken) {
            const tokenData = await jose.jwtVerify(authToken, new TextEncoder().encode("mySecretKey"))
            console.log("tokenData => ", tokenData)
            return tokenData
        }
        return "abc"
    } catch (err) {
        return "abcd"
    }
}