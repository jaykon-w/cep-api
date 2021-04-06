import { Module } from '@nestjs/common';
import { AuthModule } from '../auth.module';
import { AuthService } from '../auth.service';
import { UserModule } from '../../user/user.module';
import { RedisModule } from '../../shared/redis/redis.module';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [AuthModule, RedisModule, UserModule],
  providers: [AuthGuard, AuthService],
  exports: [AuthGuard],
})
export class GuardModule {}
