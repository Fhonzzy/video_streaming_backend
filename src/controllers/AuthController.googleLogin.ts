import { Request, Response } from "express";
import { GoogleAuthService } from "../service/AuthService.googleLogin";

export async function googleAuthController(req: Request, res: Response) {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ msg: "idToken is required" });
  }

  const result = await GoogleAuthService.googleLogin(idToken);

  return res.status(200).json({ result });
}
