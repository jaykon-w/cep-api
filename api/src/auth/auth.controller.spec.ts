import '../setup';
import '../setup.tests';

import { Test, TestingModule } from '@nestjs/testing';
import { ReturnModelType } from '@typegoose/typegoose';
import { REDIS_CONNECTION } from '../shared/redis/redis.module';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Request } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  const userService = new UserService({} as ReturnModelType<typeof User>);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: userService,
        },
        {
          provide: REDIS_CONNECTION,
          useValue: {
            set: jest.fn,
            get: jest.fn,
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should to do the login', async () => {
    const spy = jest
      .spyOn(authService, 'login')
      .mockReturnValue(Promise.resolve('jhads'));

    await controller
      .login({ email: 'teste@teste.com', password: 'teste123' }, {} as Request)
      .toPromise();

    expect(spy).toBeCalled();
  });
});
