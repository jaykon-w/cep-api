import './setup';

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from '@payk/nestjs-winston';
import * as compression from 'compression';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import { ping } from './shared/middlewares/ping';
import { loggingTest } from './shared/middlewares/testLogging';
import { version } from './shared/middlewares/version';
import { BusinessError, ERRORS } from './shared/errors/business.error';

const errorHandler = (err, req, res, next) => {
  Logger.error(err);
  const error = err;

  res.status(error.status).json(error);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.enableCors();
  app.use(helmet());
  app.use(compression());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors) =>
        new BusinessError(ERRORS.INVALID_SCHEMA, errors),
    }),
  );

  app.use('/ping', ping);
  app.use('/version', version);
  app.use('/log', loggingTest);
  app.use(errorHandler);

  const options = new DocumentBuilder()
    .setTitle('API documentation')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer(`http://${process.env.API_EXTERNAL_HOST}`)
    .addServer(`https://${process.env.API_EXTERNAL_HOST}`)
    .addServer(`http://localhost:${process.env.PORT}`)
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT, '0.0.0.0');
}
bootstrap();
