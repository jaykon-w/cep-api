import '../setup';
import '../setup.tests';

import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ReturnModelType } from '@typegoose/typegoose';
import { Redis } from 'ioredis';
import { of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { transform$ } from '../shared/observables/transform.observable';
import { validate$ } from '../shared/observables/validate.observable';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserRo } from './ro/user.ro';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  const userService = new UserService({} as ReturnModelType<typeof User>);
  const authService = new AuthService(userService, {} as Redis);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: userService,
        },
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should to fail when create an empty instance of CreateUserDto', async () => {
    try {
      await of({})
        .pipe(transform$(CreateUserDto), validate$<CreateUserDto>())
        .toPromise();
      throw new Error('Should not get here');
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });

  it('should to fail when create an instance of CreateUserDto, with a wrong fields', async () => {
    try {
      await of({
        email: 'teste',
        name: 'T',
        password: 't',
      })
        .pipe(transform$(CreateUserDto), validate$<CreateUserDto>())
        .toPromise();
      throw new Error('Should not get here');
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
      expect(err.response.message.some((e) => e.property === 'email'))
        .toBeTruthy;
      expect(err.response.message.some((e) => e.property === 'name'))
        .toBeTruthy;
      expect(err.response.message.some((e) => e.property === 'password'))
        .toBeTruthy;
    }
  });

  it('should to pass when create a valid instance of CreateUserDto', async () => {
    await of({
      email: 'teste@teste.com',
      name: 'Teste',
      password: 'teste123',
    })
      .pipe(transform$(CreateUserDto), validate$<CreateUserDto>())
      .toPromise();
  });

  it('should to call userService.create', async () => {
    const spy = jest
      .spyOn(userService, 'create')
      .mockImplementation()
      .mockReturnValue(Promise.resolve({} as any));

    controller.create({} as CreateUserDto);

    expect(spy).toBeCalled();
  });

  it('should to call userService.findMe and not return your password', async () => {
    const user = Object.assign(new User(), {
      _id: '213123123',
      name: 'Teste',
      email: 'teste@teste.com',
      password: '12312313',
    });

    const returnedUser = await controller.findMe(user).toPromise();

    expect(returnedUser).toBeInstanceOf(UserRo);
    expect(returnedUser).not.toHaveProperty('password');
  });
});
