import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { RedisModule } from '../shared/redis/redis.module';
import { AppGuard } from './guard/auth.guard';

@Module({
  imports: [forwardRef(() => UserModule), RedisModule],
  controllers: [AuthController],
  providers: [AuthService, AppGuard],
  exports: [AuthService, AppGuard],
})
export class AuthModule {}
