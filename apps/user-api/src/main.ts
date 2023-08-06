import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule
  );
  app.use(cookieParser());
  app.enableCors();
  app.setViewEngine('hbs');
  const port: number = parseInt(`${process.env.PORT}`) || 8000;
  await app.listen(port);
}
bootstrap();
