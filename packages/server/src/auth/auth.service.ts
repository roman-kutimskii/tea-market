import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { User } from 'src/users/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { Role } from './enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokensRepository: Repository<RefreshToken>,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async genereateRefreshToken(user: User): Promise<string> {
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const refreshToken = this.refreshTokensRepository.create({
      token,
      user,
      expiresAt,
    });

    await this.refreshTokensRepository.save(refreshToken);
    return token;
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    const token = await this.refreshTokensRepository.findOne({
      where: { token: refreshToken },
      relations: ['user'],
    });

    if (!token || token.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const payload = {
      sub: token.user.id,
      email: token.user.email,
      role: token.user.role,
    };
    return this.jwtService.signAsync(payload);
  }

  async signIn({ email, password }: SignInDto): Promise<unknown> {
    const user = await this.usersService.findOneByEmail(email);
    if (!(await compare(password, user.passwordHash))) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: await this.genereateRefreshToken(user),
    };
  }

  async signUp({ email, password }: SignUpDto): Promise<unknown> {
    const user = await this.usersService.create({
      email,
      password,
      role: Role.Customer,
    });
    const payload = { sub: user.id, email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: await this.genereateRefreshToken(user),
    };
  }
}
