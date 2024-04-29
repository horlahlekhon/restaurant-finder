import { Module, ValidationPipe } from '@nestjs/common';
import * as Joi from '@hapi/joi';
import appConfig from '../config/app.config';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { HttpExceptionFilter } from '../common/filters/http-exception.filters';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      cache: true,
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .required(),
        DATABASE_URL: Joi.string().required(),
        REDIS_URL: Joi.string().required(),
        REDIS_RESTAURANT_KEY: Joi.string().required(),
      }),
      load: [appConfig],
    }),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 3600000, limit: 5 }],
    }),
    RestaurantsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
  exports: [],
})
export class RootModule {}
