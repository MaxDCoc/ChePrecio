// src/entities/scan.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';

// El veredicto que devuelve el análisis de precio
export enum PriceVerdict {
  CHEAP = 'cheap', // más barato que la media
  NORMAL = 'normal', // dentro del rango normal
  EXPENSIVE = 'expensive', // más caro que la media
}

@Entity('scans')
export class Scan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Relación con User — @ManyToOne porque muchos scans pertenecen a un user
  // onDelete: 'CASCADE' → si se borra el user, se borran sus scans
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  // Relación con Product
  @ManyToOne(() => Product, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'product_id', nullable: true })
  productId: string;

  // El precio que vio el usuario, en centavos (entero)
  // Guardamos en centavos para evitar problemas de punto flotante
  // $1250.50 → 125050 centavos
  @Column({ name: 'price_cents' })
  priceCents: number;

  // URL de la foto subida a Supabase Storage
  @Column({ name: 'image_url', nullable: true })
  imageUrl: string;

  // Lo que leyó la IA de la etiqueta — guardamos el JSON completo
  @Column({ name: 'ai_reading', type: 'jsonb', nullable: true })
  aiReading: {
    name: string;
    brand: string;
    price: number;
    confidence: number; // qué tan segura está la IA (0-1)
  };

  // El veredicto final del análisis
  @Column({
    type: 'enum',
    enum: PriceVerdict,
    nullable: true,
  })
  verdict: PriceVerdict;

  // Cuánto % está sobre o bajo la media
  // positivo = más caro, negativo = más barato
  // Ej: 25 significa "25% más caro que la media"
  @Column({
    name: 'percentage_diff',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  percentageDiff: number;

  // Ubicación donde se escaneó (para comparativas por zona)
  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  lat: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  lng: number;

  @CreateDateColumn({ name: 'scanned_at' })
  scannedAt: Date;
}
