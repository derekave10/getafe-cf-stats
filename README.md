# Getafe CF — Portal de Jugadores

Portal de estadísticas históricas de la plantilla del Getafe CF.

## Stack

- Next.js 16 · Tailwind CSS v4 · shadcn/ui
- API-Football (RapidAPI) para los datos
- GitHub Actions para actualizaciones automáticas
- Vercel para hosting

## Setup

```bash
cp .env.local.example .env.local   # añade tu RAPIDAPI_KEY
npm install
npm run fetch-data                  # carga inicial de datos
npm run dev
```

## Actualización automática

GitHub Actions corre cada lunes y jueves. Configura el secret `RAPIDAPI_KEY` en tu repo de GitHub.
