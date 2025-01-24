import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAvatarDto {
  @IsNotEmpty()
  @IsString()
  avatarBase64: string;
}
