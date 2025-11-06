# 🌍 SkyBudgetFly - Guía de Deployment Fuera de Replit

## ✅ Estado de Portabilidad

**¡SÍ, el proyecto está listo para deployar en servidores externos!** 

El proyecto está diseñado de forma portable y puede ejecutarse en cualquier servidor que soporte Node.js 20+.

---

## 🎯 Plataformas Compatibles

Este proyecto puede deployarse en:

- ✅ **Heroku**
- ✅ **DigitalOcean App Platform**
- ✅ **AWS Elastic Beanstalk / EC2**
- ✅ **Google Cloud Platform (Cloud Run, App Engine)**
- ✅ **Azure App Service**
- ✅ **Railway.app**
- ✅ **Render.com**
- ✅ **Fly.io**
- ✅ **VPS (Ubuntu, CentOS, etc.)**
- ✅ Cualquier servidor con Node.js 20+

---

## 📋 Requisitos Previos

### Servidor:
- **Node.js:** 20.x o superior
- **NPM:** 10.x o superior
- **PostgreSQL:** 15.x o superior (puede ser externo como Neon, Supabase, etc.)
- **Memoria RAM:** Mínimo 512 MB (recomendado 1 GB+)
- **Espacio en disco:** Mínimo 500 MB

### Servicios Externos:
- Base de datos PostgreSQL (Neon, Supabase, AWS RDS, etc.)
- Cuenta de Stripe (producción)
- Cuenta de PayPal Business (producción)
- Cuenta de Amadeus API (producción)
- Cuenta de EmailJS

---

## 🔧 Pasos para Deployment

### 1️⃣ **Preparar el Código**

```bash
# Clonar el repositorio o descargar el código
git clone <tu-repositorio>
cd workspace

# Instalar dependencias
npm install

# Verificar que todo compile correctamente
npm run check
```

### 2️⃣ **Configurar Variables de Entorno**

Crea un archivo `.env` en la raíz del proyecto (puedes copiar `.env.example`):

```bash
# ===================================
# DATABASE
# ===================================
DATABASE_URL=postgresql://user:password@host:5432/database
PGHOST=tu-host.com
PGPORT=5432
PGDATABASE=nombre_base_datos
PGUSER=usuario
PGPASSWORD=contraseña

# ===================================
# STRIPE (Producción)
# ===================================
STRIPE_SECRET_KEY=sk_live_tu_clave_secreta
VITE_STRIPE_PUBLIC_KEY=pk_live_tu_clave_publica

# ===================================
# PAYPAL (Producción)
# ===================================
PAYPAL_CLIENT_ID=tu_client_id_produccion
PAYPAL_CLIENT_SECRET=tu_client_secret_produccion

# ===================================
# EMAILJS
# ===================================
VITE_EMAILJS_SERVICE_ID=tu_service_id
VITE_EMAILJS_TEMPLATE_ID=tu_template_id
VITE_EMAILJS_BOOKING_TEMPLATE_ID=tu_booking_template_id
VITE_EMAILJS_PAYMENT_TEMPLATE_ID=tu_payment_template_id
VITE_EMAILJS_PUBLIC_KEY=tu_public_key

# ===================================
# AMADEUS API (Producción)
# ===================================
AMADEUS_API_KEY=tu_api_key
AMADEUS_API_SECRET=tu_api_secret

# ===================================
# APPLICATION SETTINGS
# ===================================
NODE_ENV=production
PORT=5000
```

**⚠️ IMPORTANTE:** Nunca subas el archivo `.env` a tu repositorio git. Ya está en `.gitignore`.

### 3️⃣ **Configurar Base de Datos**

#### Opción A: Base de Datos Externa (Recomendado)

Usa un servicio de PostgreSQL administrado:

- **Neon** (https://neon.tech) - Gratis para comenzar
- **Supabase** (https://supabase.com) - Gratis para comenzar
- **AWS RDS** - Pago
- **DigitalOcean Managed Databases** - Pago

Una vez que tengas tu base de datos:

```bash
# Sincronizar el esquema con la base de datos
npm run db:push
```

#### Opción B: PostgreSQL Local (VPS)

Si usas un VPS, instala PostgreSQL:

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Crear base de datos y usuario
sudo -u postgres psql
CREATE DATABASE skybudgetfly;
CREATE USER tu_usuario WITH PASSWORD 'tu_password';
GRANT ALL PRIVILEGES ON DATABASE skybudgetfly TO tu_usuario;
\q

# Luego ejecuta
npm run db:push
```

### 4️⃣ **Build del Proyecto**

```bash
# Construir frontend y backend para producción
npm run build
```

Esto generará:
- `dist/public/` - Frontend compilado (React)
- `dist/index.js` - Backend compilado (Express)

### 5️⃣ **Iniciar en Producción**

```bash
# Iniciar el servidor
npm start
```

El servidor escuchará en el puerto especificado en `PORT` (por defecto 5000).

---

## 🚀 Deployment por Plataforma

### 📦 **Heroku**

1. **Crear `Procfile` en la raíz:**
```
web: npm start
```

2. **Deployment:**
```bash
heroku create nombre-tu-app
heroku addons:create heroku-postgresql:mini
git push heroku main
heroku config:set STRIPE_SECRET_KEY=sk_live_...
heroku config:set VITE_STRIPE_PUBLIC_KEY=pk_live_...
# ... configurar todas las variables
```

3. **Inicializar base de datos:**
```bash
heroku run npm run db:push
```

---

### 🌊 **DigitalOcean App Platform**

1. **Conectar tu repositorio Git**
2. **Configurar Build:**
   - Build Command: `npm run build`
   - Run Command: `npm start`
3. **Agregar Base de Datos:**
   - Crear un "Managed Database PostgreSQL"
   - Conectar automáticamente con tu app
4. **Variables de entorno:**
   - Agregar todas las variables en la sección "Environment Variables"
5. **Deploy automático** al hacer push a tu rama

---

### 🖥️ **VPS (Ubuntu/Debian)**

1. **Instalar Node.js:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

2. **Instalar PM2 (Process Manager):**
```bash
sudo npm install -g pm2
```

3. **Clonar y configurar:**
```bash
git clone <tu-repo>
cd workspace
npm install
npm run build
```

4. **Crear archivo ecosystem.config.js:**
```javascript
module.exports = {
  apps: [{
    name: 'skybudgetfly',
    script: './dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    }
  }]
};
```

5. **Iniciar con PM2:**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

6. **Configurar Nginx como reverse proxy:**
```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

7. **SSL con Let's Encrypt:**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com
```

---

### 🐳 **Docker (Opcional)**

Si prefieres usar Docker, aquí está un `Dockerfile` básico:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Build del proyecto
RUN npm run build

# Exponer puerto
EXPOSE 5000

# Iniciar aplicación
CMD ["npm", "start"]
```

Y `docker-compose.yml`:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/skybudgetfly
      - NODE_ENV=production
    depends_on:
      - db
  
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: skybudgetfly
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Deployment con Docker:
```bash
docker-compose up -d
```

---

## ⚙️ Ajustes Necesarios para Deployment Externo

### 🔧 **Remover Plugins de Replit (Opcional)**

Los plugins de Replit (`@replit/*`) ya están configurados para **NO cargar en producción**, pero si quieres limpiar completamente:

1. **Editar `vite.config.ts`:**

Reemplaza las líneas 4-20 con:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
```

2. **Remover dependencias de Replit:**

```bash
npm uninstall @replit/vite-plugin-cartographer @replit/vite-plugin-dev-banner @replit/vite-plugin-runtime-error-modal
```

**NOTA:** Esto es opcional. Los plugins ya no se cargan en producción gracias a las condiciones en el config.

---

## 🔒 Seguridad en Producción

### SSL/HTTPS:
- ✅ **OBLIGATORIO** para Stripe
- ✅ Usa Let's Encrypt (gratis) o el SSL de tu plataforma
- ✅ Configura redirección HTTP → HTTPS

### Variables de Entorno:
- ✅ Nunca incluyas `.env` en git
- ✅ Usa el sistema de secrets de tu plataforma
- ✅ Rota las claves regularmente

### Base de Datos:
- ✅ Usa SSL para conexión a base de datos
- ✅ Configura backups automáticos
- ✅ Restringe acceso por IP si es posible

### Firewall:
- ✅ Solo abre puertos 80 (HTTP) y 443 (HTTPS)
- ✅ Puerto de PostgreSQL solo accesible desde tu servidor

---

## 📊 Monitoring y Logs

### Recomendaciones:

1. **Application Monitoring:**
   - Sentry (errores)
   - New Relic (performance)
   - Datadog (infraestructura)

2. **Logs:**
   - PM2 logs: `pm2 logs`
   - Heroku logs: `heroku logs --tail`
   - CloudWatch (AWS)

3. **Uptime Monitoring:**
   - UptimeRobot (gratis)
   - Pingdom
   - StatusCake

---

## 🧪 Testing antes de Producción

```bash
# 1. Build local
npm run build

# 2. Test en modo producción localmente
NODE_ENV=production npm start

# 3. Probar endpoints clave:
curl http://localhost:5000/api/airports/search?query=miami
curl http://localhost:5000/

# 4. Verificar base de datos
npm run db:push
```

---

## 🔄 CI/CD (Opcional pero Recomendado)

### GitHub Actions Example:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - run: npm run check
      # Aquí agregarías steps para deploy a tu plataforma
```

---

## 🐛 Troubleshooting

### Error: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Error de base de datos
```bash
# Verificar conexión
psql $DATABASE_URL

# Re-sincronizar schema
npm run db:push -- --force
```

### Puerto en uso
```bash
# Cambiar PORT en .env o:
PORT=8080 npm start
```

### Stripe no funciona
- ✅ Verifica que tu sitio tenga **HTTPS**
- ✅ Usa claves de **producción** (pk_live_, sk_live_)
- ✅ Configura webhooks en dashboard de Stripe

---

## 📱 Dominios Personalizados

### Configuración DNS:

```
Tipo    Nombre    Valor
A       @         TU_IP_SERVIDOR
CNAME   www       tu-dominio.com
```

O si usas plataforma cloud (Heroku, etc.):

```
CNAME   @         tu-app.herokuapp.com
CNAME   www       tu-app.herokuapp.com
```

---

## 💰 Estimación de Costos Mensuales

### Setup Mínimo:
- **Servidor:** $5-10/mes (DigitalOcean Droplet, Railway)
- **Base de datos:** $0-10/mes (Neon gratis, o $7 managed)
- **Dominio:** $10-15/año
- **Total:** ~$10-20/mes

### Setup Profesional:
- **Servidor:** $20-50/mes (mejor performance)
- **Base de datos:** $15-30/mes (managed con backups)
- **CDN:** $5-10/mes (Cloudflare Pro)
- **Monitoring:** $10-20/mes (Sentry, etc.)
- **Total:** ~$50-110/mes

---

## ✅ Checklist Pre-Deployment

- [ ] Variables de entorno configuradas
- [ ] Base de datos PostgreSQL lista
- [ ] `npm run build` exitoso
- [ ] `npm run check` sin errores
- [ ] SSL/HTTPS configurado
- [ ] Dominio apuntando al servidor
- [ ] Backups de base de datos configurados
- [ ] Monitoring/logging configurado
- [ ] Stripe webhooks configurados
- [ ] PayPal webhooks configurados
- [ ] EmailJS templates probados
- [ ] Panel admin accesible (`/admin`)
- [ ] Prueba de pago end-to-end exitosa

---

## 🎯 Próximos Pasos

1. **Elige tu plataforma de deployment**
2. **Configura base de datos PostgreSQL**
3. **Configura variables de entorno**
4. **Haz build y deploy**
5. **Configura SSL/HTTPS**
6. **Prueba el flujo completo**
7. **Configura monitoring**
8. **¡Lanza!**

---

## 🆘 Soporte

Si encuentras problemas durante el deployment:

1. **Verifica logs del servidor**
2. **Revisa todas las variables de entorno**
3. **Confirma conexión a base de datos**
4. **Verifica que el puerto esté abierto**
5. **Prueba local primero con `NODE_ENV=production`**

---

## 📚 Recursos Adicionales

- **Node.js Deployment:** https://nodejs.org/en/docs/guides/deploying-node-app-to-production
- **PostgreSQL SSL:** https://www.postgresql.org/docs/current/ssl-tcp.html
- **Stripe Production:** https://stripe.com/docs/keys#live-mode
- **Let's Encrypt:** https://letsencrypt.org/getting-started/
- **PM2 Documentation:** https://pm2.keymetrics.io/docs/usage/quick-start/

---

**¡El proyecto está 100% listo para deployar fuera de Replit!** 🚀

No hay código específico de Replit en el runtime de producción. Todo es portable y funciona en cualquier servidor Node.js estándar.

---

**Desarrollado con ❤️ para SkyBudgetFly**
**Versión:** 1.0.0 Production Ready
**Deployment:** Portable a cualquier servidor Node.js
