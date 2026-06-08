// src/config/env.config.ts
import * as Joi from 'joi';

// Define el tipo de todas las variables de entorno del proyecto
// Si agregás una variable nueva, la agregás acá también
export interface EnvironmentVariables {
  // Servidor
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;

  // Base de datos
  DATABASE_URL: string;

  // Supabase
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;

  // Claude AI (lo usamos en la Fase 3)
  CLAUDE_API_KEY: string;
}

// Esquema de validación — define qué es obligatorio y qué tiene default
export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  PORT: Joi.number().default(3000),

  // required() → la app no arranca si falta esta variable
  DATABASE_URL: Joi.string().required(),

  SUPABASE_URL: Joi.string().uri().required(),
  SUPABASE_ANON_KEY: Joi.string().required(),

  CLAUDE_API_KEY: Joi.string().required(),
});