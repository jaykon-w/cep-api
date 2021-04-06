import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WinstonLogger } from '@payk/nestjs-winston';
import { EMPTY, from, Observable, of } from 'rxjs';
import { mergeMap, tap, throwIfEmpty } from 'rxjs/operators';
import { AuthGuard } from '../auth/guard/auth.guard';
import { SecurityContext } from '../shared/decorators/security-context.decorator';
import { throwNotFoundIfEmpty$ } from '../shared/observables/throw-not-found-if-empty.observable';
import { transform$ } from '../shared/observables/transform.observable';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserRo } from './ro/user.ro';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  private readonly logger = new WinstonLogger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new user' })
  create(@Body() createUserDto: CreateUserDto): Observable<UserRo> {
    return from(this.userService.create(createUserDto)).pipe(
      transform$(UserRo),
      tap((created) =>
        this.logger.debug(
          `user created: ${JSON.stringify(created, undefined, 2)}`,
        ),
      ),
    );
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get your user' })
  findMe(@SecurityContext() user: User): Observable<UserRo> {
    return of(user).pipe(throwNotFoundIfEmpty$(), transform$(UserRo));
  }
}
