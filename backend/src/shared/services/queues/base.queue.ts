import Logger from 'bunyan';

import Queue, { Job } from 'bull';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { IBaseJobData } from './queues.interfaces';

import { config } from '@root/config';

let bullAdapters: BullAdapter[] = [];
export let serverAdapter: ExpressAdapter;

export abstract class BaseQueue {
  queue: Queue.Queue;
  log: Logger;

  constructor(queueName: string) {
    this.queue = new Queue(queueName, `${config.REDIS_HOST}`);

    // Add new Queue to prev Queues
    bullAdapters.push(new BullAdapter(this.queue));

    // initialize serverAdapter and setup

    serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/queues');

    //Pass to create BullBoard and initialize

    createBullBoard({
      queues: [...new Set(bullAdapters)],
      serverAdapter,
    });

    this.log = config.createLogger(`${queueName} Queue`);

    this.queue.on('completed', (job: Job) => {
      job.remove();
    });

    this.queue.on('global:completed', (jobId: string) => {
      this.log.info(`Job ${jobId} completed`);
    });

    this.queue.on('global:stalled', (jobId: string) => {
      this.log.info(`Job ${jobId} is stalled`);
    });
  }

  protected addJob(name: string, data: IBaseJobData): void {
    this.queue.add(name, data, { attempts: 3, backoff: { type: 'fixed', delay: 5000 } });
  }

  protected processJob(
    name: string,
    concurrency: number,
    callback: Queue.ProcessCallbackFunction<void>,
  ): void {
    this.queue.process(name, concurrency, callback);
  }
}
