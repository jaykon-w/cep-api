import { WinstonLogger } from '@payk/nestjs-winston';
import * as os from 'os';

export function loggingTest(req, res, next): void {
  const logger = new WinstonLogger('Test Logger');
  logger.warn('teste warn');
  logger.log('teste log');
  logger.error('teste error');
  logger.debug('teste debug');
  logger.verbose('teste verbose');
  logger.log(`CONTAINER ID: ${os.hostname()}`);
  res.send(200);
  next();
}
