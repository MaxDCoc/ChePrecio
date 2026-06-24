// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';
import { AppConfigService } from '../config/app.config';

// Esta clase le dice a Passport CÓMO validar el JWT
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: AppConfigService) {
    super({
      // De dónde saca el token: del header "Authorization: Bearer <token>"
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // No expira nunca de nuestro lado — dejamos que Supabase maneje la expiración
      ignoreExpiration: false,

      // En vez de una clave fija, usamos JWKS — Supabase rota sus claves
      // y esto las obtiene dinámicamente
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,           // cachea la clave, no la pide en cada request
        rateLimit: true,       // evita pedir la clave demasiado seguido
        jwksRequestsPerMinute: 5,
        jwksUri: `${config.supabaseUrl}/auth/v1/.well-known/jwks.json`,
      }),

      algorithms: ['ES256'],   // algoritmo que usa Supabase
    });
  }

  // Este método corre DESPUÉS de validar la firma del JWT
  // Lo que retornás acá queda disponible como request.user
  async validate(payload: any) {
    return {
      id: payload.sub,           // el user.id de Supabase
      email: payload.email,
      role: payload.role,
    };
  }
}