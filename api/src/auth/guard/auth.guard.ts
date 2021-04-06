import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { WinstonLogger } from '@payk/nestjs-winston';
import { Request, Response } from 'express';
import { User } from '../../user/entities/user.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new WinstonLogger(AuthGuard.name);

  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    const user = await this.authenticate(req, res);
    if (!user) throw new UnauthorizedException();
    res.locals.user = user;

    return !!user;
  }

  private async authenticate(
    req: Request,
    res: Response,
  ): Promise<User | null> {
    if (
      !req.headers.authorization ||
      req.headers.authorization.split(' ')[0] !== 'Bearer'
    )
      return null;

    const authToken = req.headers.authorization.split(' ')[1];
    const remoteIP = (req.headers['x-forwarded-for'] || req.ip) as string;
    try {
      const user = await this.authService.checkUser(authToken, remoteIP);
      return user;
    } catch (err) {
      this.logger.info(err.message);
      return null;
    }
  }
}
