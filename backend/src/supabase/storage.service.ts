// src/supabase/storage.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';
import { randomUUID } from 'crypto';
import { AppConfigService } from '../config/app.config';

const BUCKET_NAME = 'product-photos';
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

@Injectable()
export class StorageService {
  constructor(private readonly config: AppConfigService) {}

  async uploadProductPhoto(
    file: Express.Multer.File,
    userId: string,
    accessToken: string,
  ): Promise<string> {
    this.validateFile(file);

    const supabase = createClient(
      this.config.supabaseUrl,
      this.config.supabaseAnonKey,
      {
        global: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
        realtime: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          transport: WebSocket as any, // requerido en Node < 22
        },
      },
    );

    const extension = file.originalname.split('.').pop();
    const fileName = `${userId}/${randomUUID()}.${extension}`;

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new BadRequestException(
        `Error al subir la imagen: ${error.message}`,
      );
    }

    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);

    return data.publicUrl;
  }

  private validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No se recibió ningún archivo');
    }
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `Tipo de archivo no permitido: ${file.mimetype}. Solo se aceptan: ${ALLOWED_MIME_TYPES.join(', ')}`,
      );
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new BadRequestException(
        `El archivo excede el tamaño máximo de ${MAX_FILE_SIZE_BYTES / 1024 / 1024}MB`,
      );
    }
  }
}