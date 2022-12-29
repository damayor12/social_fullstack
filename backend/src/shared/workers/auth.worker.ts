import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';

import { config } from '@root/config';
// import { IAuthDocument } from '@auth/interfaces/auth.interface';
// import { AuthModel } from '@auth/modes/auth.schema';
import { authService } from '@service/db/auth.service';

const log: Logger = config.createLogger('userCache');

// add and process job in  queue
class AuthWorker {
  async addAuthUserToDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { value } = job.data;
      await authService.createAuthUser(value);

      job.progress(100);
      done(null, job.data);
    } catch (error) {
      log.error(error);
      done(error as Error);
    }
  }
}

export const authworker: AuthWorker = new AuthWorker();
