import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ERROR_CONSTANT } from 'src/constants';
import { throwErrorMessage } from 'src/exception';
import { User } from 'src/infrastructures/mongodb/models';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtSvc: JwtService) {}
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1] as string;
    if (!token) {
      throwErrorMessage(
        { code: ERROR_CONSTANT.AUTHENTICATION_REQUIRED },
        HttpStatus.UNAUTHORIZED,
      );
      return false;
    }
    try {
      const user = await this.jwtSvc.verifyAsync<User>(token, {
        secret: process.env.JWT_SECRET,
      });
      request.user = user;
      return true;
    } catch (error) {
      console.log(error);
      throwErrorMessage(
        { code: ERROR_CONSTANT.AUTHENTICATION_REQUIRED },
        HttpStatus.UNAUTHORIZED,
      );
      return false;
    }
  }
}
