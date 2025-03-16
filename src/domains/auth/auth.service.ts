import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/infrastructures/mongodb/models';
import { LoginDTO, RegisterDTO } from './auth.dto';
import { throwErrorMessage } from 'src/exception';
import {
  ACCESS_TOKEN_CONSTANT,
  ERROR_CONSTANT,
  USER_CONSTANTS,
} from 'src/constants';
import { comparePassword, hashPassword } from 'src/helpers';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  public async register(dto: RegisterDTO): Promise<void> {
    await this.assertUserExists(dto.username);
    dto.password = hashPassword(dto.password);
    await this.userModel.create(dto);
  }

  public async login(dto: LoginDTO): Promise<string> {
    const user = await this.assertLoginUser(dto.username);
    this.assertPassword(dto.password, user.password);
    return this.generateAccessToken(user);
  }

  private async generateAccessToken(user: User): Promise<string> {
    const accessToken = await this.jwtService.signAsync(user, {
      secret: process.env.JWT_SECRET,
      expiresIn: ACCESS_TOKEN_CONSTANT.EXPIRE_SECONDS,
    });
    return accessToken;
  }

  private assertPassword(password: string, dbPassword: string) {
    const isMatched = comparePassword(password, dbPassword);
    if (!isMatched) {
      throwErrorMessage({ code: ERROR_CONSTANT.INCORRECT_PASSWORD });
    }
  }

  private async assertLoginUser(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username }).lean();
    if (!user) {
      throwErrorMessage({ code: ERROR_CONSTANT.USER_NOT_FOUND });
    }
    return user as User;
  }

  private async assertUserExists(username: string): Promise<void> {
    const user = await this.userModel.exists({ username });
    if (user) {
      throwErrorMessage({ code: ERROR_CONSTANT.EXISTS_USER });
    }
  }
}
