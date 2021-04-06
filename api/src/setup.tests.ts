import { clientAdapter } from './shared/redis/redis.module';

jest.setTimeout(30000);
jest.spyOn(clientAdapter, 'client').mockImplementation();
