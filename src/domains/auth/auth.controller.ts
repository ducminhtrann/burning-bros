import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { LoginDTO, RegisterDTO } from './auth.dto';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Post()
  @ApiOperation({ summary: 'Login and get access token' })
  public async login(@Body() body: LoginDTO, @Res() res: Response) {
    const access_token = await this.authService.login(body);
    res.status(HttpStatus.OK).send({
      message: 'ok',
      data: {
        access_token,
      },
    });
  }

  @ApiOperation({ summary: 'Register' })
  @Post('register')
  public async register(@Body() body: RegisterDTO, @Res() res: Response) {
    await this.authService.register(body);
    res.status(HttpStatus.CREATED).send({ message: 'ok' });
  }
}
