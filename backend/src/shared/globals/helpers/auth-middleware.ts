import { AuthPayload } from '@auth/interfaces/auth.interface';
import { config } from '@root/config';
import { Request, Response, NextFunction } from 'express';
import JWT from 'jsonwebtoken';
import { NotAuthorizedError } from './error-handler';

export class AuthMiddleware {
  public verifyUser(req: Request, res: Response, next: NextFunction): void {
    console.log('yesssssssssion', req.session);
    if (!req.session?.jwt) throw new NotAuthorizedError('Token is not available, login again');

    try {
      const payload = JWT.verify(req.session?.jwt, config.JWT_TOKEN!) as AuthPayload;

      req.currentUser = payload;
    } catch (error) {
      throw new NotAuthorizedError('Token is not available, login again');
    }
    next();
  }

  public checkAuthentication(req: Request, res: Response, next: NextFunction): void {
    if (!req.currentUser) throw new NotAuthorizedError('Auth is required for this route');

    next();
  }
}

export const authMiddleware = new AuthMiddleware();
