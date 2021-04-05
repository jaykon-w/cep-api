import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { EMPTY, from, Observable, of } from 'rxjs';
import { map, mergeMap, throwIfEmpty } from 'rxjs/operators';
import { transform$ } from '../shared/observables/transform.observable';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginRo } from './ro/login.ro';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  login(@Body() loginDto: LoginDto, @Req() req: Request): Observable<LoginRo> {
    return from(this.authService.login(loginDto, req.ip)).pipe(
      mergeMap((e) => (e ? of(e) : EMPTY)),
      throwIfEmpty(() => new NotFoundException()),
      map((token) => ({ token })),
      transform$(LoginRo),
    );
  }
}
