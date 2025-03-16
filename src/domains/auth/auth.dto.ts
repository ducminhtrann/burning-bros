import { IsNotEmpty, IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty({
    type: String,
    required: true,
    description: 'username',
    example: 'username01',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'password',
    example: 'passworD',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class RegisterDTO extends LoginDTO {}
