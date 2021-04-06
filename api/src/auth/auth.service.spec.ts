import '../setup';
import '../setup.tests';

import { Test, TestingModule } from '@nestjs/testing';
import { ReturnModelType } from '@typegoose/typegoose';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { REDIS_CONNECTION } from '../shared/redis/redis.module';
import { LoginDto } from './dto/login.dto';
import * as jwt from 'jsonwebtoken';

describe('AuthService', () => {
  let service: AuthService;
  const userService = new UserService({} as ReturnModelType<typeof User>);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should to generate a valid token', async () => {
    const user = Object.assign(new User(), {
      _id: '213123123',
      name: 'Teste',
      email: 'teste@teste.com',
      password: '12312313',
    });

    const spy = jest
      .spyOn(userService, 'findByEmailAndPassword')
      .mockReturnValue(Promise.resolve(user));

    const token = await service.login(
      {
        email: 'teste@teste.com',
        password: 'teste123',
      } as LoginDto,
      '0.0.0.0',
    );

    expect(jwt).toBeDefined();
    expect(jwt.verify(token, process.env.JWT_SECRET)).toBeDefined();
  });
});
