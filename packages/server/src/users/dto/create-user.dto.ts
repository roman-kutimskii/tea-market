import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  // TODO: Заменить на пароль и хешировать в контроллере (сервисе)
  @IsNotEmpty()
  passwordHash: string;
}
