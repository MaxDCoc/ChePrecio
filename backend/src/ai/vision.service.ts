// src/ai/vision.service.ts
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { AppConfigService } from '../config/app.config';
import { LabelReading } from './dto/label-reading.dto';

// El prompt que le manda las instrucciones exactas a Claude
// Está afuera de la clase porque es una constante que no cambia en runtime
const VISION_PROMPT = `Analizá esta foto de un producto de supermercado argentino.

Tu tarea es extraer:
1. El nombre del producto (sin la marca)
2. La marca
3. El precio en pesos argentinos, tal como aparece en la etiqueta o cartel de precio
4. Tu nivel de confianza en la lectura (0 a 1)

Reglas importantes:
- Si no podés ver claramente el precio, poné priceCents en null — NO inventes un número
- El precio que devuelvas debe estar en CENTAVOS (ej: $1.250,50 → 125050)
- Si la imagen no muestra un producto o etiqueta de precio reconocible, poné confidence en 0
- Respondé ÚNICAMENTE con un objeto JSON, sin texto antes ni después, sin markdown, sin \`\`\`json

Formato exacto de respuesta:
{
  "productName": "string o null",
  "brand": "string o null",
  "priceCents": number o null,
  "confidence": number entre 0 y 1,
  "rawText": "todo el texto que pudiste leer en la imagen, o null"
}`;

@Injectable()
export class VisionService {
  private readonly anthropic: Anthropic;
  // Logger es la forma estándar de NestJS de loggear con contexto
  // (te muestra de qué clase viene cada log)
  private readonly logger = new Logger(VisionService.name);

  constructor(private readonly config: AppConfigService) {
    this.anthropic = new Anthropic({
      apiKey: this.config.claudeApiKey,
    });
  }

  async readLabel(
    imageBuffer: Buffer,
    mimeType: string,
  ): Promise<LabelReading> {
    const base64Image = imageBuffer.toString('base64');

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  // El tipo debe ser uno de los soportados por la API
                  media_type: mimeType as
                    | 'image/jpeg'
                    | 'image/png'
                    | 'image/webp',
                  data: base64Image,
                },
              },
              {
                type: 'text',
                text: VISION_PROMPT,
              },
            ],
          },
        ],
      });

      return this.parseResponse(response);
    } catch (error) {
      this.logger.error('Error al llamar a Claude Vision API', error);
      throw new BadRequestException(
        'No se pudo analizar la imagen. Intentá de nuevo.',
      );
    }
  }

  private parseResponse(response: Anthropic.Message): LabelReading {
    // El contenido de la respuesta es un array de bloques
    // Buscamos el bloque de tipo "text" — es el único que esperamos acá
    const textBlock = response.content.find((block) => block.type === 'text');

    if (!textBlock || textBlock.type !== 'text') {
      throw new BadRequestException(
        'La IA no devolvió una respuesta de texto válida',
      );
    }

    const cleanedText = this.stripMarkdownFences(textBlock.text);

    let parsed: unknown;
    try {
      parsed = JSON.parse(cleanedText);
    } catch {
      this.logger.warn(
        `Claude no devolvió JSON válido: ${textBlock.text.substring(0, 200)}`,
      );
      throw new BadRequestException(
        'La IA no pudo leer la imagen correctamente',
      );
    }

    return this.validateLabelReading(parsed);
  }

  // Claude a veces envuelve el JSON en bloques de código markdown
  // (```json ... ```) a pesar de que el prompt le pide no hacerlo.
  // Esta función remueve esos fences si existen, y no hace nada si no existen.
  private stripMarkdownFences(text: string): string {
    const trimmed = text.trim();

    // Caso: ```json\n{...}\n```  o  ```\n{...}\n```
    const fenceMatch = /^```(?:json)?\s*\n([\s\S]*?)\n```$/.exec(trimmed);

    if (fenceMatch) {
      return fenceMatch[1].trim();
    }

    return trimmed;
  }

  private validateLabelReading(data: unknown): LabelReading {
    if (typeof data !== 'object' || data === null) {
      throw new BadRequestException('Respuesta de IA con formato inválido');
    }

    const obj = data as Record<string, unknown>;

    return {
      productName: typeof obj.productName === 'string' ? obj.productName : null,
      brand: typeof obj.brand === 'string' ? obj.brand : null,
      priceCents: typeof obj.priceCents === 'number' ? obj.priceCents : null,
      confidence:
        typeof obj.confidence === 'number'
          ? Math.max(0, Math.min(1, obj.confidence)) // clamp entre 0 y 1
          : 0,
      rawText: typeof obj.rawText === 'string' ? obj.rawText : null,
    };
  }
}
