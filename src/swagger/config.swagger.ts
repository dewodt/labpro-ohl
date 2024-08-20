import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Labpro OHL API')
  .setDescription('Tugas Seleksi 3 Asisten Laboratorium Programming 2024 ITB')
  .setVersion('1.0')
  .addBearerAuth({
    type: 'apiKey',
    in: 'header',
    description: 'JWT token',
  })
  .addCookieAuth('labpro-ohl-auth', {
    type: 'apiKey',
    description: 'JWT token',
  })
  .build();
