import { IAuthJob } from '@auth/interfaces/auth.interface';
import { authworker } from '@worker/auth.worker';
import { BaseQueue } from './base.queue';

class AuthQueue extends BaseQueue {
  constructor() {
    // takes in job name, concurrency number and worker function
    // processes jobs
    super('auth');
    this.processJob('addAuthUserToDB', 5, authworker.addAuthUserToDB);
  }

  // takes in job name, concurrency number and worker function
  // add the job
  public addAuthUserJob(name: string, data: IAuthJob): void {
    this.addJob(name, data);
  }
}

export const authQueue: AuthQueue = new AuthQueue();
