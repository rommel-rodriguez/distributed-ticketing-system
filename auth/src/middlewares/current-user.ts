import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth_token = req.session?.jwt;
  if (!auth_token) {
    return next();
  }
  try {
    const payload = jwt.verify(auth_token, process.env.JWT_KEY!) as UserPayload;
    // req.session = { ...req.session, currentUser: payload };
    req.currentUser = payload;
  } catch (err) {
    console.log(err);
  }
  next();
};
