import { Body, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

const HIDDEN_FIELDS = ['password'];

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor() {}
  private _logger = new Logger(LoggerMiddleware.name);
  public use(request: Request, response: Response, next: NextFunction) {
    const startAt = Date.now();
    if (request.body && Object.keys(request.body).length) {
      const body = { ...request.body };
      for (const key of Object.keys(body)) {
        if (HIDDEN_FIELDS.includes(key)) {
          body[key] = '*';
        }
      }
      this._logger.log(`REQUEST BODY - `, JSON.stringify(body));
    }
    response.once('close', () => {
      const endAt = Date.now();
      const time = endAt - startAt;
      const statusCode = response.statusCode;
      if (statusCode >= 200 && statusCode <= 299) {
        this._logger.log(
          `Request finished - [${request.method}] - ${request.url} -${time}ms`,
        );
      } else {
        this._logger.error(
          `Request failed - ${request.url} - ${statusCode} - ${time}ms`,
        );
      }
    });
    next();
  }
}
