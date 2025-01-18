import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signIn({ email, password }: SignInDto): Promise<unknown> {
    const user = await this.usersService.findOneByEmail(email);
    if (!(await compare(password, user.passwordHash))) {
      throw new UnauthorizedException();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...result } = user;
    return result;
  }

  async signUp({ email, password }: SignUpDto): Promise<unknown> {
    const salt = await genSalt();
    const passwordHash = await hash(password, salt);
    const user = await this.usersService.create({
      email,
      passwordHash,
      role: 'customer',
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...result } = user;
    return result;
  }
}
