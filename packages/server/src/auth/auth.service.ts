import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn({ email, password }: SignInDto): Promise<unknown> {
    const user = await this.usersService.findOneByEmail(email);
    if (!(await compare(password, user.passwordHash))) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, email: email };
    return {
      access_toker: await this.jwtService.signAsync(payload),
    };
  }

  async signUp({ email, password }: SignUpDto): Promise<unknown> {
    const salt = await genSalt();
    const passwordHash = await hash(password, salt);
    const user = await this.usersService.create({
      email,
      passwordHash,
      role: 'customer',
    });
    const payload = { sub: user.id, email: email };
    return {
      access_toker: await this.jwtService.signAsync(payload),
    };
  }
}
