import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { AuthModel } from '@auth/modes/auth.schema';
import { Helpers } from '@global/helpers/helpers';

class AuthService {
  public async getUserByUserNameOrEmail(username: string, email: string): Promise<IAuthDocument> {
    const query = {
      $or: [
        { username: Helpers.firstLetterUppercase(username) },
        { email: Helpers.lowercase(email) },
      ],
    };

    const user: IAuthDocument = (await AuthModel.findOne(query).exec()) as IAuthDocument;
    return user;
  }
}

export const authService: AuthService = new AuthService()
