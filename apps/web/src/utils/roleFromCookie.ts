import { getCookie } from "../actions/cookies";
import * as jose from "jose";

export async function getRoleAndUserIdFromCookie() {
  const authToken = await getCookie("authToken");
  if (authToken) {
    try {
      const tokenData = await jose.jwtVerify(authToken, new TextEncoder().encode("mySecretKey"));
      const payload = tokenData.payload as { role: string, id: number };
      return { role: payload.role, userId: payload.id };
    } catch (err) {
      console.error("Error in getRoleAndUserIdFromCookie:", err);
      return null;
    }
  }
  return null;
}

