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
import { AccessToken } from './auth/access-token.decorator';
import { StorageService } from './supabase/storage.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly storageService: StorageService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: CurrentUserPayload) {
    return { message: 'JWT válido', user };
  }

  @Post('test-upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async testUpload(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: CurrentUserPayload,
    @AccessToken() accessToken: string,
  ) {
    const url = await this.storageService.uploadProductPhoto(
      file,
      user.id,
      accessToken,
    );
    return { message: 'Foto subida con éxito', url };
  }
}
