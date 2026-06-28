// src/supabase/storage.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { StorageService } from './storage.service';
import { AppConfigService } from '../config/app.config';

// Mock de AppConfigService — StorageService solo necesita estas dos props
const mockAppConfigService = {
  supabaseUrl: 'https://fake-project.supabase.co',
  supabaseAnonKey: 'fake-anon-key',
};

function createMockFile(
  overrides: Partial<Express.Multer.File> = {},
): Express.Multer.File {
  return {
    fieldname: 'file',
    originalname: 'test.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    size: 1024,
    buffer: Buffer.from('fake-image-content'),
    destination: '',
    filename: '',
    path: '',
    stream: null as any,
    ...overrides,
  };
}

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StorageService,
        {
          provide: AppConfigService,
          useValue: mockAppConfigService,
        },
      ],
    }).compile();

    service = module.get<StorageService>(StorageService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadProductPhoto — validaciones', () => {
    it('debería rechazar un archivo undefined', async () => {
      await expect(
        service.uploadProductPhoto(undefined as any, 'user-123', 'fake-token'),
      ).rejects.toThrow(BadRequestException);
    });

    it('debería rechazar un tipo de archivo no permitido', async () => {
      const file = createMockFile({ mimetype: 'application/pdf' });

      await expect(
        service.uploadProductPhoto(file, 'user-123', 'fake-token'),
      ).rejects.toThrow('Tipo de archivo no permitido');
    });

    it('debería rechazar un archivo que excede el tamaño máximo', async () => {
      const file = createMockFile({ size: 11 * 1024 * 1024 });

      await expect(
        service.uploadProductPhoto(file, 'user-123', 'fake-token'),
      ).rejects.toThrow('excede el tamaño máximo');
    });
  });
});