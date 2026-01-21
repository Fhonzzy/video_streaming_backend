"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_LIFETIME = (_a = process.env.JWT_ACCESS_EXPIRES_IN) !== null && _a !== void 0 ? _a : "15m";
const REFRESH_LIFETIME = (_b = process.env.JWT_REFRESH_EXPIRES_IN) !== null && _b !== void 0 ? _b : "30d";
const accessTokenOption = {
    expiresIn: ACCESS_LIFETIME,
};
const refreshTokenOption = {
    expiresIn: REFRESH_LIFETIME,
};
function generateAccessToken(payload) {
    return jsonwebtoken_1.default.sign(payload, ACCESS_SECRET, accessTokenOption);
}
function generateRefreshToken(payload) {
    const refreshPayload = {
        userId: payload.userId,
        tenantId: payload.tenantId,
        tokenType: "refresh",
    };
    return jsonwebtoken_1.default.sign(refreshPayload, REFRESH_SECRET, refreshTokenOption);
}
