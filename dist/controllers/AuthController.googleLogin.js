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
exports.googleAuthController = googleAuthController;
const AuthService_googleLogin_1 = require("../service/AuthService.googleLogin");
function googleAuthController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { idToken } = req.body;
        if (!idToken) {
            return res.status(400).json({ msg: "idToken is required" });
        }
        const result = yield AuthService_googleLogin_1.GoogleAuthService.googleLogin(idToken);
        return res.status(200).json({ result });
    });
}
