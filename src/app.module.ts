import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongoDbModule } from './infrastructures/mongodb';
import { AuthModule } from './domains/auth';
import { LoggerMiddleware } from './middlewares';
import { ProductModule } from './domains/products';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: join(__dirname, 'i18n'),
        watch: true,
      },
      resolvers: [AcceptLanguageResolver],
    }),
    CacheModule.register({ isGlobal: true }),
    MongoDbModule,
    AuthModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
