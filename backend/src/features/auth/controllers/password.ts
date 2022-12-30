import { Request, Response } from 'express';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { authService } from '@service/db/auth.service';
import { BadRequestError } from '@global/helpers/error-handler';
import HTTP_STATUS from 'http-status-codes';
import { config } from '@root/config';
import publicIP from 'ip';
import moment from 'moment';
import { emailSchema, passwordSchema } from '@auth/schemes/password';
import crypto from 'crypto';
import { forgotPasswordTemplate } from '@service/emails/templates/forgotPassword/forgotPassword-template';
import { emailQueue } from '@service/queues/email.queue';
import { resetPasswordTemplate } from '@service/emails/templates/resetPassword/resetPassword-template';

export class Password {
  @joiValidation(emailSchema)
  public async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    const existingUser = await authService.getAuthUserByEmail(email);

    if (!existingUser) throw new BadRequestError('Invalid Credentials');

    const randomBytes = await Promise.resolve(crypto.randomBytes(20));
    const randomCharacters = randomBytes.toString('hex');

    await authService.createTemporaryPasswordToken(
      `${existingUser._id}`,
      randomCharacters,
      Date.now() * 60 * 60 * 1000,
    );

    const resetLink = `${config.CLIENT_URL}/reset-password?token=${randomCharacters}`;

    const template = forgotPasswordTemplate.getForgotPasswordTemplate(
      existingUser.username!,
      resetLink,
    );

    // fire email queue to add the job
    emailQueue.addEmailJob('forgotPasswordEmail', {
      template,
      receiverEmail: email,
      subject: 'Reset your password',
    });

    // send response
    res.status(HTTP_STATUS.OK).json({ message: 'Reset password email sent' });
  }

  @joiValidation(passwordSchema)
  public async updateNewPassword(req: Request, res: Response) {
    const { password, confirmPassword } = req.body;
    const { token } = req.params;

    const existingUser = await authService.getAuthUserByPasswordToken(token);

    if (!existingUser) throw new BadRequestError('Reset token is likely expired');

    existingUser.password = password;
    existingUser.passwordResetExpires = undefined;
    existingUser.passwordResetToken = undefined;

    await existingUser.save();

    const templateParams = {
      username: existingUser.username,
      email: existingUser.email,
      ipaddress: publicIP.address(),
      date: moment().format('DD//MM//YYYY HH:mm'),
    };

    const randomBytes = await Promise.resolve(crypto.randomBytes(20));
    const randomCharacters = randomBytes.toString('hex');

    const template = resetPasswordTemplate.getResetPasswordTemplate(templateParams);

    // fire email queue to add the job
    emailQueue.addEmailJob('forgotPasswordEmail', {
      template,
      receiverEmail: existingUser.email,
      subject: 'Password Changed',
    });

    // send response
    res.status(HTTP_STATUS.OK).json({ message: 'Password updated' });
  }
}

export const password = new Password();
