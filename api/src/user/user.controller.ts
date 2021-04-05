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
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap, throwIfEmpty } from 'rxjs/operators';
import { AppGuard } from '../auth/guard/auth.guard';
import { SecurityContext } from '../shared/decorators/security-context.decorator';
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
  async create(@Body() createUserDto: CreateUserDto): Promise<void> {
    await this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(AppGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get your user' })
  findMe(@SecurityContext() user: User): Observable<UserRo> {
    this.logger.error('OIEEE');
    return of(user).pipe(
      mergeMap((e) => (e ? of(e) : EMPTY)),
      throwIfEmpty(() => new NotFoundException()),
      transform$(UserRo),
    );
  }
}
