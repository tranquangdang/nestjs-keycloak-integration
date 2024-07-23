import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { configurations } from '../config/config';
import { AllExceptionFilter } from '../filters/exception.filter';
import { LoggerModule } from '../logger/logger.module';
import { LoggingInterceptor } from '../interceptors/logger.interceptor';
import { AuthModule } from './auth/auth.module';
import { KeyCloakConfigModule } from './keycloak/keycloak.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [...configurations],
      envFilePath: ['.env.production', '.env.local'],
    }),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 10, limit: 200 }],
    }),
    KeyCloakConfigModule,
    LoggerModule,
    AuthModule,
    UserModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_FILTER, useClass: AllExceptionFilter },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
