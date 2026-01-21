import { googleClient } from "./google";

interface GoogleUserPayload {
  googleUserId: string;
  email: string;
  name?: string;
  picture?: string;
}

export async function verifyGoogleIdToken(
  idToken: string,
): Promise<GoogleUserPayload> {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload || !payload.sub || !payload.email) {
    throw new Error("Invalid Google token");
  }

  return {
    googleUserId: payload.sub,
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
  };
}
