import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv'
import { Environment } from './common/enums';

dotenv.config();

const getAllowedOrigins = (environment: Environment) => {

  if (environment === Environment.DEVELOPMENT) {
    return ['http://localhost:3000'];
  }

  return '*';
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
    bufferLogs: true,
  });
  const port = process.env.port || process.env.SERVER_PORT;

  // Setting the node process timezone
  process.env.TZ = 'Africa/Lagos';

  app.setGlobalPrefix('api/v1');
  
  app.enableCors({
    origin: getAllowedOrigins(environment),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(port);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
