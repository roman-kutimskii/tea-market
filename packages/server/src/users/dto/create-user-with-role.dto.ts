import { IsNotEmpty } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class CreateUserWithRoleDto extends CreateUserDto {
  @IsNotEmpty()
  role: string;
}
