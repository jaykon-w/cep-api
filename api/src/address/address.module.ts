import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { Address } from './entities/address.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypegooseModule.forFeature([Address]), AuthModule],
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule {}
