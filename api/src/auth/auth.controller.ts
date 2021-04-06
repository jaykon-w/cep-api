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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { EMPTY, from, Observable, of } from 'rxjs';
import { map, mergeMap, throwIfEmpty } from 'rxjs/operators';
import { throwNotFoundIfEmpty$ } from '../shared/observables/throw-not-found-if-empty.observable';
import { transform$ } from '../shared/observables/transform.observable';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginRo } from './ro/login.ro';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiOperation({ summary: 'Login in API' })
  login(@Body() loginDto: LoginDto, @Req() req: Request): Observable<LoginRo> {
    return from(this.authService.login(loginDto, req.ip)).pipe(
      throwNotFoundIfEmpty$(),
      map((token) => ({ token })),
      transform$(LoginRo),
    );
  }
}
