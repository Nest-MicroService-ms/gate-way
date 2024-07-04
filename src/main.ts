import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config/envs';
import { HttpsExceptionFilter } from './common';

/*
* Link Dccs
* - https://docs.nestjs.com/microservices/basics
* - https://nats.io/
* - https://hub.docker.com/_/nats
* - - docker run -d --name nats-server -p 4222:4222 -p 8222:8222 nats:lates
* - - http://localhost:8222/
* Instalar packe
* - npm i --save @nestjs/microservices
* - npm i --save nats
* 
*/

async function bootstrap() {

  const logger = new Logger('Main-GeteWay');

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('API');
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  app.useGlobalFilters(new HttpsExceptionFilter())
  await app.listen(envs.PORT);

  logger.log(`Geteway Running On POrt ${ envs.PORT }`)
}
bootstrap();
