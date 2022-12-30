import { IResetPasswordParams } from '@user/interfaces/user.interface';
import ejs from 'ejs';
import fs from 'fs';

class ResetPasswordTemplate {
  public getResetPasswordTemplate(templateParams: IResetPasswordParams): string {
    return ejs.render(fs.readFileSync(__dirname + '/resetPassword-template.ejs', 'utf-8'), {
      username: templateParams.username,
      email: templateParams.email,
      ipaddress: templateParams.ipaddress,
      date: templateParams.date,
      image_url:
        'https://w7.pngwing.com/pngs/120/102/png-transparent-padlock-logo-computer-icons-padlock-technic-logo-password-lock.png',
    });
  }
}

export const resetPasswordTemplate: ResetPasswordTemplate = new ResetPasswordTemplate();
