// backend/data-source.ts
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from './src/entities/user.entity';
import { Product } from './src/entities/product.entity';
import { Scan } from './src/entities/scan.entity';
import { SepaPrice } from './src/entities/sepa-price.entity';

// Carga el .env manualmente (TypeORM CLI no usa NestJS)
config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, Product, Scan, SepaPrice],
  migrations: ['src/migrations/*{.ts,.js}'],
  ssl: { rejectUnauthorized: false },
});