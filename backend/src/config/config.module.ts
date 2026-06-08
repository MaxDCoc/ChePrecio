// src/config/config.module.ts
import { Global, Module } from '@nestjs/common';
import { AppConfigService } from './app.config';

// @Global() → disponible en toda la app sin importarlo en cada módulo
@Global()
@Module({
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}