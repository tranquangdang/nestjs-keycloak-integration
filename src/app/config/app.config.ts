import { registerAs } from '@nestjs/config';
import { Environment } from './config';

export enum AppConfigKey {
  APP_NAME = 'APP_NAME',
  NODE_ENV = 'NODE_ENV',
  PORT = 'PORT',
}

export type IAppConfig = {
  [AppConfigKey.APP_NAME]: string | undefined;
  [AppConfigKey.NODE_ENV]: string | undefined;
  [AppConfigKey.PORT]: string | undefined;
};

export default registerAs('', () => ({
  [AppConfigKey.APP_NAME]: process.env[AppConfigKey.APP_NAME],
  [AppConfigKey.NODE_ENV]: Environment[process.env[AppConfigKey.NODE_ENV] as keyof typeof Environment] || 'local',
  [AppConfigKey.PORT]: process.env[AppConfigKey.PORT],
}));
