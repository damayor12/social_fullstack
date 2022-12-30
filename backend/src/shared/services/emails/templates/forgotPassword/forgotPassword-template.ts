import ejs from 'ejs';
import fs from 'fs';

class ForgotPasswordTemplate {
  public getForgotPasswordTemplate(username: string, resetLink: string): string {
    return ejs.render(fs.readFileSync(__dirname + '/forgotPassword-template.ejs', 'utf-8'), {
      username,
      resetLink,
      image_url:
        'https://w7.pngwing.com/pngs/120/102/png-transparent-padlock-logo-computer-icons-padlock-technic-logo-password-lock.png',
    });
  }
}

export const forgotPasswordTemplate: ForgotPasswordTemplate = new ForgotPasswordTemplate();
