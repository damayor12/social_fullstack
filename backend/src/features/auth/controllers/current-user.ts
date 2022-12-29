import { Request, Response } from 'express';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { IAuthDocument, ISignUpData } from '@auth/interfaces/auth.interface';
import { authService } from '@service/db/auth.service';
import { BadRequestError } from '@global/helpers/error-handler';
import HTTP_STATUS from 'http-status-codes';
import { config } from '@root/config';
import JWT from 'jsonwebtoken';
import { loginSchema } from '@auth/schemes/signin';
import { IUserDocument } from '@user/interfaces/user.interface';
import { userService } from '@service/db/user.service';
import { UserCache } from '@service/redis/user.cache';

const userCache: UserCache = new UserCache();

export class CurrentUser {
  // check if user is already logged in anytime and did not log out, 
  public async read(req: Request, res: Response) {
    let isUser = false;
    let token = false;
    let user = null;

    const cachedUser = (await userCache.getUserFromCache(
      `${req.currentUser!.userId}`,
    )) as IUserDocument;

    const existingUser: IUserDocument = cachedUser
      ? cachedUser
      : await userService.getUserById(`${req.currentUser!.userId}`);

    if (Object.keys(existingUser).length) {
      isUser = true;
      token = req.session?.jwt;
      user = existingUser;
    }

    res.status(HTTP_STATUS.OK).json({ isUser, user, token });
  }
}
