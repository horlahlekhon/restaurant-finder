import { NestFactory } from '@nestjs/core';
import { RootModule } from './modules/root/root.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as process from 'process';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);
  const configService = app.get(ConfigService);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const config = new DocumentBuilder()
    .setTitle('Restaurant finder')
    .setDescription('Api description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config, {});
  SwaggerModule.setup('api', app, document);

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);
}
bootstrap();
