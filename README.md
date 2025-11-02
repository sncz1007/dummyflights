# Dummy Flights / SkyVisionAI

Guía rápida para instalar, configurar y ejecutar el proyecto en Windows (funciona también en macOS/Linux con mínimos ajustes).

## Requisitos
- Node.js 18+ y npm 9+
- Git
- Cuenta (opcional) en Neon o Postgres para base de datos

## Instalación
```bash
npm install
```

## Ejecución (desarrollo)

Opción sencilla con `tsx` (recomendada en Windows):
```powershell
$env:NODE_ENV = "development"
$env:PORT = "5000"
$env:STRIPE_SECRET_KEY = "sk_test_dummy"
$env:VITE_STRIPE_PUBLIC_KEY = "pk_test_dummy"
$env:SESSION_SECRET = "super_secret_key"
# Si tienes base de datos, configura DATABASE_URL (Neon/Postgres). Ejemplo sin SSL:
# $env:DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/postgres?sslmode=disable"

npx tsx server/index.ts
```

Alternativa con `cross-env`:
```bash
npx cross-env NODE_ENV=development PORT=5000 STRIPE_SECRET_KEY=sk_test_dummy VITE_STRIPE_PUBLIC_KEY=pk_test_dummy SESSION_SECRET=super_secret_key npx tsx server/index.ts
```

También puedes usar el script de npm si lo prefieres:
```bash
npm run dev
```

Por defecto la app escucha en `http://localhost:5000` (ver `server/index.ts`).

## Variables de entorno

Consulta `.env.example` para el listado completo. Mínimas para arrancar:
- `PORT` (por defecto `5000`)
- `NODE_ENV` (por ejemplo `development`)
- `SESSION_SECRET` (cadena aleatoria segura)
- `STRIPE_SECRET_KEY` (clave privada; para pruebas puedes usar un dummy)
- `VITE_STRIPE_PUBLIC_KEY` (clave pública expuesta al cliente)
- `DATABASE_URL` (requerido si vas a usar persistencia real)

Otras variables soportadas (opcional según funcionalidades):
- EmailJS: `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`
- Amadeus: `AMADEUS_CLIENT_ID`, `AMADEUS_CLIENT_SECRET`
- Postgres (para herramientas/CLI): `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`

Notas:
- Variables que empiezan por `VITE_` se exponen al frontend (Vite).
- No compartas secretos. Añade `.env` a `.gitignore` si aún no está.

## Base de datos
- ORM: `drizzle-orm` con `@neondatabase/serverless`.
- El servidor exige `DATABASE_URL` si vas a ejecutar operaciones de almacenamiento reales (`server/db.ts`).
- Para preparar el esquema/migraciones, revisa los scripts de Drizzle y usa `npm run db:push` si está disponible.

## Scripts útiles
- `npm run dev`: levanta el entorno de desarrollo.
- `npm run build`: compila cliente y servidor.
- `npm run start`: arranca en modo producción (requiere variables de entorno configuradas).
- `npm run check`: type-check del proyecto.
- `npm run db:push`: sincroniza el esquema de la base de datos (si aplica).

## Solución de problemas
- Error `ENOTSUP reusePort` en Windows: ya está mitigado en `server/index.ts` deshabilitando `reusePort` en Windows.
- Puerto 5000 ocupado: cambia `PORT` o libera el puerto.
- `DATABASE_URL` faltante: define la variable o ejecuta sin rutas que persistan datos.

## Producción
1. Configura todas las variables de entorno (Stripe, EmailJS, Amadeus, DB).
2. Compila: `npm run build`.
3. Arranca: `npm run start`.

## Estructura
- `server/`: API Express y utilidades (Stripe, Amadeus, Drizzle).
- `client/`: frontend Vite/React.
- `shared/`: tipos y utilidades compartidas.
- `public/`: assets estáticos.

## Enlaces
- Repo: https://github.com/sncz1007/dummyflights
- Dev local: http://localhost:5000/