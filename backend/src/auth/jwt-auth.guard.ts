// src/auth/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// AuthGuard('jwt') usa la JwtStrategy que acabamos de crear
// Si el JWT es inválido o no existe, automáticamente responde 401 Unauthorized
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
