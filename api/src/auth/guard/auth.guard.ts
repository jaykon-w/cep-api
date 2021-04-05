import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { WinstonLogger } from '@payk/nestjs-winston';
import { Request, Response } from 'express';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';

@Injectable()
export class AppGuard implements CanActivate {
  private readonly logger = new WinstonLogger(AppGuard.name);

  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    const autenticatedEmail = await this.authenticate(req, res);
    if (!autenticatedEmail) throw new UnauthorizedException();

    const user = await this.userService.findByEmail(autenticatedEmail);

    if (!user) throw new UnauthorizedException();
    res.locals.user = user;

    return !!user;
  }

  private async authenticate(
    req: Request,
    res: Response,
  ): Promise<string | null> {
    if (
      !req.headers.authorization ||
      req.headers.authorization.split(' ')[0] !== 'Bearer'
    )
      return null;

    const authToken = req.headers.authorization.split(' ')[1];
    const remoteIP = (req.headers['x-forwarded-for'] || req.ip) as string;
    try {
      const _auth = await this.authService.checkUser(authToken, remoteIP);
      return _auth?.email;
    } catch (err) {
      this.logger.info(err.message);
      return null;
    }
  }
}
