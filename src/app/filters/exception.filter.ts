import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { LoggerFactory } from '../logger/custom.logger';
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { Response, Request } from 'express';
import { Error as MongooseError } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { IAppConfig, AppConfigKey } from '../config/app.config';
import { Environment } from '../config/config';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerFactory, private readonly configService: ConfigService) {}

  private static handleResponse(response: Response, responseBody: any, statusCode: number): void {
    response.status(statusCode).json(responseBody);
  }

  catch(exception: HttpException | Error, host: ArgumentsHost): void {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const request: Request = ctx.getRequest();
    const response: Response = ctx.getResponse();

    let responseBody;

    if (exception instanceof HttpException) {
      const errRes = exception.getResponse();

      responseBody = {
        ...(typeof errRes === 'object' ? { ...errRes } : { message: errRes }),
        statusCode: exception.getStatus(),
      };
    } else if (exception instanceof MongooseError) {
      responseBody = {
        message: exception.message,
        statusCode: HttpStatus.BAD_REQUEST,
      };
    } else if (exception instanceof Error) {
      responseBody = {
        message: exception.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    } else {
      responseBody = {
        message: 'Internal server error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }

    // Handling error message and logging
    this.handleMessage(request, exception, responseBody.statusCode);

    // Response to client
    AllExceptionFilter.handleResponse(
      response,
      responseBody.statusCode === HttpStatus.INTERNAL_SERVER_ERROR ? 'Internal server error' : responseBody,
      responseBody.statusCode
    );
  }

  private handleMessage(request: Request, exception: HttpException | MongooseError | Error, statusCode: number): void {
    const { query, params, body, method } = request;

    const isProduction =
      this.configService.get<IAppConfig['NODE_ENV']>(AppConfigKey.NODE_ENV) === Environment.Production;

    if (!isProduction) {
      console.error(exception);
    }

    let errorMessage: string;

    if (exception instanceof HttpException) {
      errorMessage = JSON.stringify(exception.getResponse());
    } else if (exception instanceof MongooseError) {
      errorMessage = exception?.message;
    } else if (exception instanceof Error) {
      errorMessage = exception?.stack?.toString() ?? '';
    } else {
      errorMessage = 'Unknown error';
    }

    const log = `${method} ${statusCode} ${exception?.name} ${errorMessage} { q: ${JSON.stringify(
      query
    )}, p: ${JSON.stringify(params)}, b: ${JSON.stringify(body)}}`;

    this.logger.error(log);
  }
}
