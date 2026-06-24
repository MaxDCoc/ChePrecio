// src/config/app.config.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './env.config';

// Este servicio reemplaza al ConfigService genérico
// El IDE te autocompleta las variables y detecta errores de tipeo
@Injectable()
export class AppConfigService {
  constructor(
    private readonly config: ConfigService<EnvironmentVariables, true>,
  ) {}

  // Servidor
  get port(): number {
    return this.config.get('PORT', { infer: true });
  }

  get nodeEnv(): string {
    return this.config.get('NODE_ENV', { infer: true });
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  // Base de datos
  get databaseUrl(): string {
    return this.config.get('DATABASE_URL', { infer: true });
  }

  // Supabase
  get supabaseUrl(): string {
    return this.config.get('SUPABASE_URL', { infer: true });
  }

  get supabaseAnonKey(): string {
    return this.config.get('SUPABASE_ANON_KEY', { infer: true });
  }

  // Claude AI
  get claudeApiKey(): string {
    return this.config.get('CLAUDE_API_KEY', { infer: true });
  }
}
