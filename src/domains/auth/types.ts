import { User } from '../../infrastructures/mongodb/models';

declare module 'express' {
  interface Request {
    user?: User;
  }
}
