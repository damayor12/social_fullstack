import { ServerError } from '@global/helpers/error-handler';
import { config } from '@root/config';
import { IUserDocument } from '@root/features/user/interfaces/user.interface';
import { BaseCache } from '@service/redis/base.cache';
import Logger from 'bunyan';

const log: Logger = config.createLogger('userCache');


export class UserCache extends BaseCache {
  constructor() {
    super('userCache');
  }

  public async saveUserCache(
    key: string,
    userUId: string,
    createdUser: IUserDocument,
  ): Promise<void> {
    const createdAt = new Date();

    const {
      _id,
      uId,
      username,
      email,
      avatarColor,
      blocked,
      blockedBy,
      postsCount,
      profilePicture,
      bgImageId,
      followersCount,
      followingCount,
      notifications,
      work,
      location,
      school,
      quote,
      bgImageVersion,
      social,
    } = createdUser;

    const firstList: string[] = [
      '_id',
      `${_id}`,
      'uId',
      `${uId}`,
      'username',
      `${username}`,
      'email',
      `${email}`,
      'avatarColor',
      `${avatarColor}`,
      'createdAt',
      `${createdAt}`,
      'postsCount',
      `${postsCount}`,
    ];

    const secondList: string[] = [
      'blocked',
      JSON.stringify(blocked),
      'blockedBy',
      JSON.stringify(blockedBy),
      'profilePicture',
      `${profilePicture}`,
      'followersCount',
      `${followersCount}`,
      'followingCount',
      `${followingCount}`,
      'notifications',
      JSON.stringify(notifications),
      'social',
      JSON.stringify(social),
    ];
    const thirdList: string[] = [
      'work',
      `${work}`,
      'location',
      `${location}`,
      'school',
      `${school}`,
      'quote',
      `${quote}`,
      'bgImageVersion',
      `${bgImageVersion}`,
      'bgImageId',
      `${bgImageId}`,
    ];
    const dataToSave: string[] = [...firstList, ...secondList, ...thirdList];

    try {
      //  if no connection, create connection
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      // CREATING SORTED SET
      await this.client.ZADD('user', { score: parseInt(userUId, 10), value: `${key}` }); 
      await this.client.HSET(`users:${key}`, dataToSave);
    } catch (error) {
      log.error(error);
      throw new ServerError('Redis error. Try again.');
    }
  }
}
