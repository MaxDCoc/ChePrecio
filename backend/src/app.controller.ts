// src/app.controller.ts
import {
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { CurrentUser } from './auth/current-user.decorator';
import type { CurrentUserPayload } from './auth/current-user.decorator';
import { StorageService } from './supabase/storage.service';
import { VisionService } from './ai/vision.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly storageService: StorageService,
    private readonly visionService: VisionService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: CurrentUserPayload) {
    return { message: 'Tu JWT es válido', user };
  }

  @Post('test-upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async testUpload(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    // Necesitamos pasar un token de acceso real para subir a Storage
    // Por ahora usamos un placeholder — lo resolvemos bien en el paso de Scans
    const url = await this.storageService.uploadProductPhoto(
      file,
      user.id,
      'placeholder-token',
    );
    return { message: 'Foto subida con éxito', url };
  }

  // Endpoint temporal de prueba — se va a mover al ScansModule
  @Post('test-vision')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async testVision(@UploadedFile() file: Express.Multer.File) {
    const reading = await this.visionService.readLabel(
      file.buffer,
      file.mimetype,
    );
    return {
      message: 'Análisis completado',
      reading,
    };
  }
}
