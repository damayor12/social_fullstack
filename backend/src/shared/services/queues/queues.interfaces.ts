import { IAuthJob } from '@auth/interfaces/auth.interface';
import { IEmailJob } from '@user/interfaces/user.interface';

export type IBaseJobData = IAuthJob | IEmailJob;
