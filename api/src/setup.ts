import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import * as path from 'path';

dotenvExpand(
  dotenv.config({
    debug: true,
    path: path.resolve(process.cwd(), '../.env.dev'),
  }),
);
