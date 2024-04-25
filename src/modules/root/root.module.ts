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
      cache: true,
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.required(),
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
