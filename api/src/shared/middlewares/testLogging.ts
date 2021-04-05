import { Logger } from '@nestjs/common';
import * as os from 'os';

export function loggingTest(req, res, next): void {
  Logger.warn('teste warn');
  Logger.log('teste log');
  Logger.error('teste error');
  Logger.debug('teste debug');
  Logger.verbose('teste verbose');
  Logger.log(`CONTAINER ID: ${os.hostname()}`);
  res.send(200);
  next();
}
