// src/entities/product.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // El código de barras identifica unívocamente al producto
  // nullable: true porque la IA puede identificar el producto
  // por nombre sin necesitar el código de barras
  @Column({ nullable: true, unique: true })
  barcode: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true })
  category: string;

  // La unidad de medida: "500g", "1L", "6 unidades", etc.
  @Column({ nullable: true })
  unit: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany('Scan', 'product')
  scans: any[];
}
