import { verifyGoogleIdToken } from "../config/google_auth";
import { db } from "../database/database";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

export class GoogleAuthService {
  static async googleLogin(idToken: string) {
    const googleUser = await verifyGoogleIdToken(idToken);

    return await db.transaction().execute(async (trx) => {
      let user = await trx
        .selectFrom("users")
        .selectAll()
        .where("googleId", "=", googleUser.googleUserId)
        .executeTakeFirst();

      if (!user) {
        const tenant = await trx
          .insertInto("tenants")
          .values({
            name: googleUser.email.split("@")[0],
          })
          .returning("id")
          .executeTakeFirstOrThrow();

        user = await trx
          .insertInto("users")
          .values({
            tenantId: tenant.id,
            email: googleUser.email,
            googleId: googleUser.googleUserId,
            avatar: googleUser.picture ?? null,
            fullName: googleUser.name ?? null,
          })
          .returningAll()
          .executeTakeFirstOrThrow();
      }

      const accessToken = generateAccessToken({
        userId: user.id,
        tenantId: user.tenantId,
      });

      const refreshToken = generateRefreshToken({
        userId: user.id,
        tenantId: user.tenantId,
      });

      await trx
        .insertInto("refreshTokens")
        .values({
          userId: user.id,
          tokenHash: refreshToken,
          expiresAt: new Date(Date.now() + 30 * 24 * 24 * 60 * 1000),
        })
        .execute();

      return {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.id,
          fullname: user.fullName,
          avatar: user.avatar,
          tenantId: user.tenantId,
        },
      };
    });
  }
}
