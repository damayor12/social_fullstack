import { Router } from 'express';
import express from 'express';
import { Signup } from '@auth/controllers/signup';
import { SignIn } from '@auth/controllers/signin';
import { SignOut } from '@auth/controllers/signout';

class AuthRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post('/signup', Signup.prototype.create);
    this.router.post('/signin', SignIn.prototype.read);

    return this.router;
  }

  public signoutRoute(): Router {
    this.router.get('/signout', SignOut.prototype.signout);

    return this.router;
  }
}

export const authRoutes: AuthRoutes = new AuthRoutes();
