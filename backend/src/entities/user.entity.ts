// src/entities/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

// @Entity() le dice a TypeORM que esta clase = tabla en la DB
// El nombre de la tabla va a ser 'users' (plural automático)
@Entity('users')
export class User {
  // UUID generado automáticamente — más seguro que un ID numérico
  // porque no revela cuántos usuarios tenés
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'display_name' })
  displayName: string;

  // La contraseña NUNCA se guarda en texto plano
  // Se guarda el hash — lo vemos en el AuthService
  @Column({ name: 'password_hash' })
  passwordHash: string;

  // Cuántos escaneos hizo este usuario — para gamificación futura
  @Column({ name: 'scan_count', default: 0 })
  scanCount: number;

  // Estas dos columnas las maneja TypeORM automáticamente
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relación: un User tiene muchos Scans
  // No genera columna — es solo para hacer joins en el código
  @OneToMany('Scan', 'user')
  scans: any[];
}
