import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppConfigKey, IAppConfig } from '../config/app.config';
import { ValidationConfig } from '../config/validation.config';
import { NestExpressApplication } from '@nestjs/platform-express';

export class App {
  public static async start(module: any) {
    const app = await NestFactory.create<NestExpressApplication>(module);
    await App.setup(app);
  }

  public static async setup(app: NestExpressApplication) {
    const configService = app.get(ConfigService);
    const port = configService.get<IAppConfig['PORT']>(AppConfigKey.PORT) as string;

    app.useGlobalPipes(new ValidationPipe(ValidationConfig));

    await app.listen(port);
  }
}
