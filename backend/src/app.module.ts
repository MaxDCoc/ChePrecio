// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/config.module';
import { validationSchema } from './config/env.config';

@Module({
  imports: [
    // Carga y VALIDA el .env al arrancar
    // Si falta alguna variable required(), la app no arranca
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,          // ← validación con Joi
      validationOptions: {
        abortEarly: false,       // muestra TODOS los errores, no solo el primero
      },
    }),

    // Módulo de configuración tipada — disponible en toda la app
    AppConfigModule,

    // Conexión a Supabase
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        ssl: { rejectUnauthorized: false },
        logging: config.get('NODE_ENV') === 'development',
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}