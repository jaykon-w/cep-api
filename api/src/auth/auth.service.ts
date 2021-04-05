import { Injectable } from '@nestjs/common';
import * as ioredis from 'ioredis';
import * as jwt from 'jsonwebtoken';
import { InjectRedis } from '../shared/redis/redis.module';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    @InjectRedis() private redis: ioredis.Redis,
  ) {}

  async login(
    { email, password }: LoginDto,
    ip: string,
  ): Promise<string | null> {
    const user = await this.userService.findByEmailAndPassword(email, password);
    if (!user) return null;

    await this.redis.set(`logged:${user.email}`, ip, 'EX', 60 * 60);

    const token = jwt.sign(
      {
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      },
    );

    return token;
  }

  async checkUser(
    token: string,
    ip: string,
  ): Promise<{ email: string } | null> {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userIP: string = await this.getLoggedUser(decoded['email']);

    if (userIP !== ip) return null;
    return decoded as any;
  }

  private async getLoggedUser(email: string) {
    return this.redis.get(`logged:${email}`);
  }
}
