import { IsString } from 'class-validator';

export class loginFormDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
