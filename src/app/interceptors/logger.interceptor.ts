import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerFactory } from '../logger/custom.logger';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private loggerFactory: LoggerFactory, private readonly configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const req: Request = httpContext.getRequest();
    const res: Response = httpContext.getResponse();

    const { method, params, query, body } = req;

    return next.handle().pipe(
      tap(() => {
        const statusCode = res.statusCode;

        if (statusCode < 300 && statusCode >= 200) {
          const message = `${method} ${statusCode}  {q: ${JSON.stringify(query)}, p: ${JSON.stringify(
            params
          )}, b: ${JSON.stringify(body)}}`;

          this.loggerFactory.info(message);
        }
      })
    );
  }
}
