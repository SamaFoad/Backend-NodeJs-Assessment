import 'dotenv/config';
import { cleanEnv, port, str, host } from 'envalid';

const cleanedEnv = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'], default: 'development' }),
  PROTOCOL: str({ choices: ['http', 'https'], default: 'http' }),
  HOST: host({ default: 'localhost' }),
  PORT: port({ default: 3002 }),
  API_ROOT: str({ default: '/' }),
  CHANNEL_NAME: str({ default: 'Users' }),
});

process.env = Object.assign(process.env, cleanedEnv);
process.env.HOST_URL = `${process.env.PROTOCOL}://${process.env.HOST}${process.env.PORT ? `:${process.env.PORT}` : ''}`;

import App from './app';
const app = new App();

app.listen();
