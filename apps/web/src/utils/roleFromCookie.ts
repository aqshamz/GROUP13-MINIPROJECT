import { getCookie } from "../actions/cookies";
import * as jose from "jose";

export async function getRoleFromCookie() {
  const authToken = await getCookie("authToken");
  if (authToken) {
    try {
      const tokenData = await jose.jwtVerify(authToken, new TextEncoder().encode("mySecretKey"));
      const payload = tokenData.payload as { role: string };
      return payload.role;
    } catch (err) {
      console.error("Error in getRoleFromCookie:", err);
      return null;
    }
  }
  return null;
}