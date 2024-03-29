import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';

import { config } from '@root/config';
import { userService } from '@service/db/user.service';
import { mailTransport } from '@service/emails/mail.transport';

const log: Logger = config.createLogger('emailWorker');

class EmailWorker {
  async addNotificationEmailJob(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { receiverEmail, subject, template } = job.data;
      await mailTransport.sendEmail(receiverEmail, subject, template);

      job.progress(100);
      done(null, job.data);
    } catch (error) {
      log.error(error);
      done(error as Error);
    }
  }
}

export const emailWorker: EmailWorker = new EmailWorker();
