
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

export const authGuard = (req: AuthRequest, res: Response, next: NextFunction) => {
 
  const tokenFromCookie = req.cookies?.["access-token"];

  
  const header = req.headers.authorization;
  const tokenFromHeader = header?.startsWith("Bearer ") ? header.split(" ")[1] : undefined;

  const token = tokenFromCookie || tokenFromHeader;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized access: Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
