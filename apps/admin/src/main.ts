import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { resolve } from 'path';
import * as hbs from 'hbs';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './admin.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );

  app.useStaticAssets(resolve('apps/admin/public/'));
  app.setBaseViewsDir(resolve('apps/admin/views/'));
  app.setViewEngine('hbs');
  app.use(cookieParser());
  hbs.registerPartials(resolve('apps/admin/views/partials/'))
  await app.listen(3003);
}
bootstrap();
