// src/entities/sepa-price.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('sepa_prices')
// @Index acelera las búsquedas por estas columnas
// Sin índice, buscar entre millones de registros es lento
@Index(['barcode', 'province'])
export class SepaPrice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  barcode: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  brand: string;

  // Nombre de la cadena: "Carrefour", "Coto", "Día", etc.
  @Column({ name: 'store_chain' })
  storeChain: string;

  @Column()
  province: string;

  @Column({ name: 'price_cents' })
  priceCents: number;

  // Fecha del dato del SEPA — para saber qué tan fresco es
  @Column({ name: 'price_date', type: 'date' })
  priceDate: Date;
}
