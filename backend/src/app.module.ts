// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/config.module';
import { validationSchema } from './config/env.config';
import { User } from './entities/user.entity';
import { Product } from './entities/product.entity';
import { Scan } from './entities/scan.entity';
import { SepaPrice } from './entities/sepa-price.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      validationOptions: { abortEarly: false },
    }),

    AppConfigModule,

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        // Registramos todas las entidades acá
        entities: [User, Product, Scan, SepaPrice],
        synchronize: false,
        ssl: { rejectUnauthorized: false },
        logging: config.get('NODE_ENV') === 'development',
        // Carpeta donde van las migraciones
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
      }),
    }),

    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
