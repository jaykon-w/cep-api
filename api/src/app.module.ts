import * as winston from 'winston';
import * as WinstonLogStash from 'winston3-logstash-transport';

import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { WinstonModule } from '@payk/nestjs-winston';
import { TypegooseModule } from 'nestjs-typegoose';
import { BusinessErrorFilter } from './shared/filters/business-error.filter';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { MongoErrorFilter } from './shared/filters/mongo-error.filter';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AddressModule } from './address/address.module';

@Module({
  imports: [
    TypegooseModule.forRoot(process.env.DB_URI, {
      ...JSON.parse(process.env.DB_OPTIONS),
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      loggerLevel: process.env.LOG_LEVEL,
    }),
    WinstonModule.forRoot({
      level: process.env.LOG_LEVEL || 'info',
      transports: [
        new winston.transports.Console(),
        new WinstonLogStash({
          level: process.env.LOG_LEVEL || 'info',
          port: 5000,
          label: 'cep_api',
          host: process.env.LOG_HOST,
          mode: 'udp',
        }),
      ],
    }),
    AddressModule,
    AuthModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: BusinessErrorFilter,
    },
    {
      provide: APP_FILTER,
      useClass: MongoErrorFilter,
    },
  ],
})
export class AppModule {}
