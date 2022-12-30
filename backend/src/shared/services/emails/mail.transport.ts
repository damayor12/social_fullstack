import Logger from 'bunyan';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import sendGridMail from '@sendgrid/mail';
import { config } from '@root/config';
import { BadRequestError } from '@global/helpers/error-handler';

interface IMailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

const log: Logger = config.createLogger('mailOptions');
sendGridMail.setApiKey(config.SENDGRID_API_KEY!);

class MailTransport {
  public async sendEmail(receiverEmail: string, subject: string, body: string) {
    if (config.NODE_ENV === 'test' || config.NODE_ENV) {
      this.devEmailSender(receiverEmail, subject, body);
    } else {
      this.prodEmailSender(receiverEmail, subject, body);
    }
  }

  private async devEmailSender(receiverEmail: string, subject: string, body: string) {
    const transporter: Mail = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: config.SENDER_EMAIL, // generated ethereal user
        pass: config.SENDER_EMAIL_PASSWORD, // generated ethereal password
      },
    });

    const mailOptions: IMailOptions = {
      from: `Chatty App <${config.SENDER_EMAIL!}`, // sender address
      to: receiverEmail, // list of receivers
      subject, // Subject line
      html: body, // html body
    };

    try {
      await transporter.sendMail(mailOptions);
      log.info('Development email sent successfully');
    } catch (error) {
      log.error('Error sending email', error);
      throw new BadRequestError('Error sending email');
    }
  }

  private async prodEmailSender(receiverEmail: string, subject: string, body: string) {
    const mailOptions: IMailOptions = {
      from: `Chatty App <${config.SENDER_EMAIL!}`, // sender address
      to: receiverEmail, // list of receivers
      subject, // Subject line
      html: body, // html body
    };

    try {
      await sendGridMail.send(mailOptions);
      log.info('Prod email sent successfully');
    } catch (error) {
      log.error('Error sending email', error);
      throw new BadRequestError('Error sending email');
    }
  }
}

export const mailTransport: MailTransport = new MailTransport();
