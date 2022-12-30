import { emailWorker } from '@worker/email.worker';
import { BaseQueue } from '@service/queues/base.queue';
import { IEmailJob } from '@user/interfaces/user.interface';

class EmailQueue extends BaseQueue {
  constructor() {
    // takes in job name, concurrency number and worker function
    // processes jobs
    super('emails');
    this.processJob('forgotPasswordEmail', 5, emailWorker.addNotificationEmailJob);
  }

  // takes in job name, concurrency number and worker function
  // add the job
  public addEmailJob(name: string, data: IEmailJob): void {
    this.addJob(name, data);
  }
}

export const emailQueue: EmailQueue = new EmailQueue();
