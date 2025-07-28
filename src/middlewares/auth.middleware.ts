
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: any;
}

export const authGuard = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized access: Token missing' });
  }

  try {
    
    const actualToken = token.startsWith('Bearer ')
      ? token.split(' ')[1]
      : token;

    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET as string);
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
