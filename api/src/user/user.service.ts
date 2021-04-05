import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { BindDocTo } from '../shared/decorators/bind-doc-to.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Cacheable } from '@type-cacheable/core';
import { clientAdapter } from '../shared/redis/redis.module';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: ReturnModelType<typeof User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
  }

  @BindDocTo(User)
  findOne(id: string): Promise<User | null> {
    return this.userModel
      .findOne({
        _id: id,
      })
      .exec();
  }

  @BindDocTo(User)
  @Cacheable({
    cacheKey: (args) => args[0],
    hashKey: 'userByEmail',
    client: clientAdapter,
    ttlSeconds: 60 * 60,
  })
  findByEmail(email: string): Promise<User | null> {
    return this.userModel
      .findOne({
        email,
      })
      .exec();
  }

  @BindDocTo(User)
  findByEmailAndPassword(email: string, pass: string): Promise<User | null> {
    return this.userModel
      .findOne({
        email,
      })
      .exec()
      .then(async (e) => {
        if (!e) return null;

        const checked = await bcrypt.compare(pass, e.password);
        return checked ? e : null;
      });
  }
}
