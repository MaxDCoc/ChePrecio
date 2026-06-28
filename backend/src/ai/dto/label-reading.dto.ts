// src/ai/dto/label-reading.dto.ts

// Lo que Claude Vision nos devuelve después de leer la etiqueta
export interface LabelReading {
  productName: string | null;
  brand: string | null;
  // El precio en CENTAVOS, igual que en nuestra entidad Scan
  // null si la IA no pudo leer ningún precio en la imagen
  priceCents: number | null;
  // Qué tan segura está la IA de su lectura, de 0 a 1
  // 0.9+ = muy clara, 0.5 = dudosa, <0.3 = probablemente no hay info confiable
  confidence: number;
  // Texto crudo que la IA detectó, útil para debug si algo sale mal
  rawText: string | null;
}
