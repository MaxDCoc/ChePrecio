// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';
import { AppConfigService } from '../config/app.config';

// Tiparlo elimina los "Unsafe member access on an `any` value"
interface SupabaseJwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: AppConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${config.supabaseUrl}/auth/v1/.well-known/jwks.json`,
      }),
      algorithms: ['ES256'],
    });
  }

  // Tipamos el parámetro como SupabaseJwtPayload en vez de any
  // y marcamos el método async sin await con Promise<...> explícito,
  // eso resuelve el warning de "Async method has no await expression"
  validate(payload: SupabaseJwtPayload): {
    id: string;
    email: string;
    role: string;
  } {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
