import '../setup';
import '../setup.tests';

import { ReturnModelType } from '@typegoose/typegoose';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    service = new UserService({} as ReturnModelType<typeof User>);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
