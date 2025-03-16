import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { I18nContext } from 'nestjs-i18n';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private _logger = new Logger(HttpExceptionFilter.name);
  private _translatePathPrefix = 'error';
  public catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const { code, message }: ResponseException =
      exception.getResponse() as ResponseException;
    this._logger.error('Unhandled exception', exception.stack);
    const i18n = I18nContext.current() as I18nContext<Record<string, unknown>>;
    let translatedMessage: string;
    try {
      translatedMessage =
        message ||
        i18n.translate(`${this._translatePathPrefix}.${code}`, {
          defaultValue: i18n.translate(
            `${this._translatePathPrefix}.some_thing_went_wrong`,
          ),
        });
    } catch (error) {
      translatedMessage = 'Some thing went wrong!';
    }
    // console.log(exception.stack);
    response.status(status).json({
      status,
      timestamp: new Date().toISOString(),
      path: request.url,
      code: code || 'unknown',
      message: translatedMessage,
    });
  }
}

export type ResponseException = {
  status?: HttpStatus;
  code?: string;
  message?: string;
};

export function throwErrorMessage(
  exception: ResponseException = {},
  statusCode = HttpStatus.BAD_REQUEST,
) {
  exception['code'] = exception?.code || 'some_thing_went_wrong';
  throw new HttpException(exception, exception?.status || statusCode);
}
