import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Base API')
  .setDescription('Base project API')
  .setVersion('1.0')
  .build();
