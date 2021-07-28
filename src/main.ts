import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as hbs from 'hbs';
import * as session from 'express-session';
import {sessionConstants} from './auth/constants';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(session(sessionConstants));

  app.setViewEngine('hbs');

  app.useStaticAssets(join(__dirname, '..', 'public'))
  app.setBaseViewsDir(join(__dirname, '..', 'views'))
  hbs.registerPartials(join(__dirname, '..', 'views/partials'));
  
  await app.listen(3000);
}

bootstrap();