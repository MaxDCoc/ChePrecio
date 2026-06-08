# ChePrecio

App para comparar precios de productos en supermercados argentinos.
Escaneás la etiqueta con la cámara, la IA la lee y te dice si el precio
está caro, normal o barato comparado con el mercado.

## Stack

- **Backend:** NestJS + TypeORM + Supabase (PostgreSQL)
- **Mobile:** React Native + Expo
- **IA:** Claude Vision API
- **Datos:** SEPA / Precios Claros
- **CI/CD:** GitHub Actions + Railway

## Estructura

cheprecio/
├── backend/   → API REST en NestJS
└── mobile/    → App React Native con Expo

## Cómo correr en desarrollo

### Backend
cd backend
npm run start:dev

### Mobile
cd mobile
npx expo start