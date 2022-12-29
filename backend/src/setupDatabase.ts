import mongoose from 'mongoose';
import 'colors';
import { config } from './config';
import Logger from 'bunyan';
import { redisConnection } from '@service/redis/redis.createConnection';

const log: Logger = config.createLogger('setupDatabase');

export default () => {
  const connect = () => {
    console.log('YESSSSSSS        =>',config.DATABASE_URL);
    mongoose
      .connect(config.DATABASE_URL!)
      .then(() => {
        log.info('Connected to database'.green.inverse);
        redisConnection.connect();
      })
      .catch((error) => {
        log.error('Error connecting to db', error);
        return process.exit(1);
      });
  };

  connect();

  mongoose.connection.on('disconnected', connect);
};
