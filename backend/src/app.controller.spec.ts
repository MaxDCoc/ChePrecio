// src/app.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StorageService } from './supabase/storage.service';
import { VisionService } from './ai/vision.service'; // Asegurate de que la ruta sea correcta

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: StorageService,
          useValue: {
            uploadProductPhoto: jest.fn(),
          },
        },
        {
          provide: VisionService,
          useValue: {
            readLabel: jest.fn().mockResolvedValue({
              productName: 'Producto Falso',
              brand: 'Marca Falsa',
              priceCents: 150050,
              confidence: 0.95,
              rawText: 'Producto Falso Marca Falsa $1500,50',
            }),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
