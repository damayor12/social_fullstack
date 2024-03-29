import { authRoutes } from '@auth/routes/auth.routes';
import { currentUserRoutes } from '@auth/routes/currentRoutes';
import { authMiddleware } from '@global/helpers/auth-middleware';
import { serverAdapter } from '@service/queues/base.queue';
import { Application } from 'express';

const BASE_PATH = '/api/v1';
export default (app: Application) => {
  const routes = () => {
    app.use('/queues', serverAdapter.getRouter());

    // unprotected routes
    app.use(BASE_PATH, authRoutes.routes());
    app.use(BASE_PATH, authRoutes.signoutRoute());

    // protected routes
    app.use(BASE_PATH, authMiddleware.verifyUser, currentUserRoutes.routes());
  };

  routes();
};
