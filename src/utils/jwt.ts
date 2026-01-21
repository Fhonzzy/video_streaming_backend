import jwt, { SignOptions } from "jsonwebtoken";
// import type {StringValue} from "jsonwebtoken"

type ExpiresIn = `${number}${"s" | "m" | "h" | "d" | "y"}` | number;

interface AccessTokenPayload {
  userId: string;
  tenantId: string;
}

interface RefreshTokenPayload {
  userId: string;
  tenantId: string;
  tokenType: "refresh";
}

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

const ACCESS_LIFETIME = process.env.JWT_ACCESS_EXPIRES_IN ?? "15m";
const REFRESH_LIFETIME = process.env.JWT_REFRESH_EXPIRES_IN ?? "30d";

const accessTokenOption: SignOptions = {
  expiresIn: ACCESS_LIFETIME as ExpiresIn,
};
const refreshTokenOption: SignOptions = {
  expiresIn: REFRESH_LIFETIME as ExpiresIn,
};

export function generateAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, accessTokenOption);
}

export function generateRefreshToken(payload: {
  userId: string;
  tenantId: string;
}): string {
  const refreshPayload: RefreshTokenPayload = {
    userId: payload.userId,
    tenantId: payload.tenantId,
    tokenType: "refresh",
  };

  return jwt.sign(refreshPayload, REFRESH_SECRET, refreshTokenOption);
}
