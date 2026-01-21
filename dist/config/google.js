"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleClient = void 0;
const google_auth_library_1 = require("google-auth-library");
if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("GOOGLE_CLIENT_ID is not set");
}
exports.googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
