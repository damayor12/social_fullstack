import { userWorker } from '@worker/user.worker';
import { BaseQueue } from '@service/queues/base.queue';

class UserQueue extends BaseQueue {
  constructor() {
    // takes in job name, concurrency number and worker function
    // processes jobs
    super('user');
    this.processJob('addUserToDB', 5, userWorker.addUserToDB);
  }

  // takes in job name, concurrency number and worker function
  // add the job
  public addUserJob(name: string, data: any): void {
    this.addJob(name, data);
  }
}

export const userQueue: UserQueue = new UserQueue();
