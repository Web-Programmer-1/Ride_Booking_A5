// csrf.middleware.ts
import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

export const issueCsrf = (req: Request, res: Response, next: NextFunction) => {
  if (!req.cookies["csrf-token"]) {
    const token = crypto.randomBytes(20).toString("hex");
    res.cookie("csrf-token", token, {
      httpOnly: false, 
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      path: "/",
    });
  }
  next();
};


export const verifyCsrf = (req: Request, res: Response, next: NextFunction) => {
  const cookieToken = req.cookies["csrf-token"];
  const headerToken = req.header("x-csrf-token");
  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({ message: "CSRF token invalid" });
  }
  next();
};
