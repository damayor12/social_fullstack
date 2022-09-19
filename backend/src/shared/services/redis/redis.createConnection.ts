import { config } from '@root/config';
import Logger from 'bunyan';
import { BaseCache } from './base.cache';
import 'colors'

const log: Logger = config.createLogger('redisConnection')

class RedisConnection extends BaseCache {
  constructor() {
    super('redisConnection');
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect()
      const res = await this.client.ping()
      console.log(`Connected Redis >>>>>>`.magenta.inverse, res)
    } catch (error) {
      log.error(error)
    }
  }
}

export const redisConnection = new RedisConnection();