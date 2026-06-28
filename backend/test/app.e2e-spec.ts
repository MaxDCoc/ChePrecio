// test/app.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { Server } from 'http';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  // beforeAll levanta la app UNA SOLA VEZ para todos los tests
  // de este archivo (no en cada test, sería muy lento)
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api'); // igual que en main.ts
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api', () => {
    it('debería responder Hello World', () => {
      return request(app.getHttpServer() as Server)
        .get('/api')
        .expect(200)
        .expect('Hello World!');
    });
  });

  describe('GET /api/me', () => {
    it('debería responder 401 sin token de autenticación', () => {
      return request(app.getHttpServer() as Server)
        .get('/api/me')
        .expect(401);
    });

    it('debería responder 401 con un token inválido', () => {
      return request(app.getHttpServer() as Server)
        .get('/api/me')
        .set('Authorization', 'Bearer token-invalido-falso')
        .expect(401);
    });

    // Este test SÍ necesita un token real de Supabase
    // Lo tomamos de una variable de entorno que vamos a setear
    // solo para tests, así no hardcodeamos un token que puede expirar
    it('debería responder 200 con un token válido', () => {
      const validToken = process.env.TEST_USER_JWT;

      // Si no seteamos el token, SALTAMOS el test en vez de fallar
      // esto evita que el pipeline falle si todavía no configuramos el token de test
      if (!validToken) {
        console.warn(
          '⚠️  TEST_USER_JWT no está seteado — saltando test de token válido',
        );
        return;
      }

      return request(app.getHttpServer() as Server)
        .get('/api/me')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200)
        .expect((res) => {
          const body = res.body as { user: { id: string; email: string } };
          expect(body.user).toHaveProperty('id');
          expect(body.user).toHaveProperty('email');
        });
    });
  });
});
