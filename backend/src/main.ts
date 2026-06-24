import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefijo global para todas las rutas → /api/...
  app.setGlobalPrefix('api');

  // Valida automáticamente los DTOs en todos los endpoints
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina campos que no están en el DTO
      forbidNonWhitelisted: true, // error si llegan campos extra
      transform: true, // convierte strings a números automáticamente
    }),
  );

  // Habilita CORS para que la app móvil pueda hablar con el backend
  app.enableCors();

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`ChePrecio backend corriendo en http://localhost:${port}/api`);
}

bootstrap().catch((error) => {
  console.error('Error fatal al arrancar la app:', error);
  process.exit(1);
});
