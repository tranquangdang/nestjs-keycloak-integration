import { Injectable, LoggerService, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WinstonModule, utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import { AppConfigKey, IAppConfig } from '../config/app.config';
import { Environment } from '../config/config';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerFactory {
  private readonly infoLogger: LoggerService;
  private readonly errorLogger: LoggerService;

  constructor(private readonly configService: ConfigService) {
    this.infoLogger = this.createLogger('info');
    this.errorLogger = this.createLogger('error');
  }

  private createLogger(level: 'info' | 'error'): LoggerService {
    const isProduction =
      this.configService.get<IAppConfig['NODE_ENV']>(AppConfigKey.NODE_ENV) === Environment.Production;

    return WinstonModule.createLogger({
      level,
      format: winston.format.combine(
        winston.format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike('API', {
          colors: !isProduction,
          prettyPrint: true,
        })
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          dirname: `dist/app/logs`,
          filename: `${level}.txt`,
          level,
        }),
      ],
    });
  }

  error(message: string, trace?: string, context?: string): void {
    this.errorLogger.error(message, { trace, context });
  }

  // warn(message: string, context?: string): void {
  //   this.logger.warn(message, { context });
  // }

  // debug(message: string, context?: string): void {
  //   this.logger.debug(message, { context });
  // }

  // verbose(message: string, context?: string): void {
  //   this.logger.verbose(message, { context });
  // }

  info(message: string, meta?: Record<string, any>): void {
    this.infoLogger.log({
      message,
      ...meta,
    });
  }
}
