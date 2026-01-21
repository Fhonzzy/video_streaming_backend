"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAuthService = void 0;
const google_auth_1 = require("../config/google_auth");
const database_1 = require("../database/database");
const jwt_1 = require("../utils/jwt");
class GoogleAuthService {
    static googleLogin(idToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const googleUser = yield (0, google_auth_1.verifyGoogleIdToken)(idToken);
            return yield database_1.db.transaction().execute((trx) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                let user = yield trx
                    .selectFrom("users")
                    .selectAll()
                    .where("googleId", "=", googleUser.googleUserId)
                    .executeTakeFirst();
                if (!user) {
                    const tenant = yield trx
                        .insertInto("tenants")
                        .values({
                        name: googleUser.email.split("@")[0],
                    })
                        .returning("id")
                        .executeTakeFirstOrThrow();
                    user = yield trx
                        .insertInto("users")
                        .values({
                        tenantId: tenant.id,
                        email: googleUser.email,
                        googleId: googleUser.googleUserId,
                        avatar: (_a = googleUser.picture) !== null && _a !== void 0 ? _a : null,
                        fullName: (_b = googleUser.name) !== null && _b !== void 0 ? _b : null,
                    })
                        .returningAll()
                        .executeTakeFirstOrThrow();
                }
                const accessToken = (0, jwt_1.generateAccessToken)({
                    userId: user.id,
                    tenantId: user.tenantId,
                });
                const refreshToken = (0, jwt_1.generateRefreshToken)({
                    userId: user.id,
                    tenantId: user.tenantId,
                });
                yield trx
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
            }));
        });
    }
}
exports.GoogleAuthService = GoogleAuthService;
