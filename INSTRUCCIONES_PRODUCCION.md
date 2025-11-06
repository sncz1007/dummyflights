# 🚀 SkyBudgetFly - Instrucciones de Configuración para Producción

## 📋 Resumen del Proyecto

**SkyBudgetFly** es una plataforma web bilingüe (Inglés/Español) que vende tickets aéreos ficticios (dummy flight tickets) a $15 USD por pasajero. La plataforma utiliza datos de vuelos **100% reales** de la API de Amadeus Production y genera PDFs profesionales con códigos PNR y números de ticket IATA auténticos.

---

## ✅ Estado Actual del Proyecto

### Completamente Implementado:
- ✅ Búsqueda de vuelos con datos reales de Amadeus Production API
- ✅ Sistema de pago dual: **PayPal (PRODUCCIÓN)** + **Stripe (pendiente)**
- ✅ Generación automática de PDFs profesionales (Confirmación de Reserva + Recibo de Pago)
- ✅ Notificaciones por email vía EmailJS
- ✅ Panel de administración protegido con contraseña (`/admin`)
- ✅ Base de datos PostgreSQL con Drizzle ORM
- ✅ Interfaz bilingüe completa (ES/EN)
- ✅ Sistema de caché de resultados de vuelos
- ✅ Tracking de descargas de PDFs
- ✅ **100% listo para producción**

---

## 🔑 Variables de Entorno Requeridas

### 1️⃣ **PayPal - CONFIGURADO ✅**
Las credenciales de producción de PayPal **YA ESTÁN CONFIGURADAS** en los Secrets de Replit:
```bash
PAYPAL_CLIENT_ID=tu_client_id_produccion_actual
PAYPAL_CLIENT_SECRET=tu_client_secret_produccion_actual
```

### 2️⃣ **Stripe - PENDIENTE ⏳**
Para activar Stripe en producción, necesitas agregar estas claves **DESPUÉS** de que tu sitio esté publicado:

**Dónde obtener las claves:**
1. Ve a https://dashboard.stripe.com/apikeys
2. Activa el modo "Producción" (Production mode)
3. Copia las claves de producción

**Variables a configurar en Replit Secrets:**
```bash
# Clave secreta del servidor (Backend)
STRIPE_SECRET_KEY=sk_live_tu_clave_secreta_de_stripe

# Clave pública del frontend
VITE_STRIPE_PUBLIC_KEY=pk_live_tu_clave_publica_de_stripe
```

**⚠️ IMPORTANTE:**
- Stripe REQUIERE un sitio con HTTPS para funcionar en producción
- Primero publica tu sitio en Replit (obtendrás un dominio .replit.app con HTTPS)
- Luego agrega las claves de Stripe a los Secrets
- El proyecto funcionará perfectamente con solo PayPal mientras tanto

### 3️⃣ **Amadeus API - CONFIGURADO ✅**
Las credenciales de Amadeus Production API ya están configuradas:
```bash
AMADEUS_API_KEY=tu_api_key_actual
AMADEUS_API_SECRET=tu_api_secret_actual
```

### 4️⃣ **EmailJS - CONFIGURADO ✅**
Las credenciales de EmailJS ya están configuradas:
```bash
VITE_EMAILJS_SERVICE_ID=tu_service_id
VITE_EMAILJS_TEMPLATE_ID=tu_template_id
VITE_EMAILJS_BOOKING_TEMPLATE_ID=tu_booking_template_id
VITE_EMAILJS_PAYMENT_TEMPLATE_ID=tu_payment_template_id
VITE_EMAILJS_PUBLIC_KEY=tu_public_key
```

### 5️⃣ **Base de Datos - CONFIGURADA AUTOMÁTICAMENTE ✅**
Replit configura automáticamente las siguientes variables:
```bash
DATABASE_URL=postgresql://...
PGHOST=...
PGPORT=...
PGDATABASE=...
PGUSER=...
PGPASSWORD=...
```

---

## 🔐 Sobre SESSION_SECRET

**¿Qué es `SESSION_SECRET`?**

`SESSION_SECRET` es una variable de entorno que se usa comúnmente en aplicaciones web para **cifrar las sesiones de usuario** (cookies de sesión). Es una cadena aleatoria que actúa como clave de seguridad.

**🔍 Estado en este proyecto:**

**Actualmente NO se está utilizando** en SkyBudgetFly. El proyecto no implementa autenticación de usuarios ni manejo de sesiones con cookies. Por lo tanto, **puedes ignorar completamente esta variable**.

**¿Por qué aparece en los archivos?**

- Está en `.env.example` como un template estándar para futuros desarrollos
- Está en `README.md` como ejemplo de configuración
- **NO está siendo usada en ningún archivo del servidor actual**

**Si decides implementar autenticación en el futuro:**

Generarías un secreto aleatorio con:
```bash
openssl rand -base64 32
```

Y lo usarías para configurar express-session o passport.js. Pero **por ahora no es necesario**.

---

## 📝 Pasos para Poner el Proyecto en Producción

### Paso 1: Publicar el Sitio en Replit

1. **Haz clic en el botón "Deploy" (Publicar)** en la parte superior de Replit
2. Sigue los pasos del asistente de publicación
3. Obtendrás un dominio como: `https://tu-proyecto.replit.app`
4. **Importante:** Este dominio tiene HTTPS automático, necesario para Stripe

### Paso 2: Configurar Stripe en Producción

Una vez que tu sitio esté publicado con HTTPS:

1. Ve a https://dashboard.stripe.com/apikeys
2. Cambia a modo **"Production"** (arriba a la derecha)
3. Copia las claves de producción

4. **En Replit, agrega los Secrets:**
   - Ve a la pestaña "Secrets" (candado 🔒 en el panel izquierdo)
   - Agrega:
     ```
     STRIPE_SECRET_KEY = sk_live_...
     VITE_STRIPE_PUBLIC_KEY = pk_live_...
     ```

5. **Reinicia el servidor:**
   - El servidor detectará automáticamente las nuevas claves
   - Verás en la consola: `[Payment] Stripe initialized successfully`

### Paso 3: Verificar Todo Funciona

1. **Prueba de búsqueda de vuelos:**
   - Busca un vuelo (Miami → Pereira, por ejemplo)
   - Verifica que aparezcan resultados reales

2. **Prueba de pago con PayPal:**
   - Selecciona un vuelo
   - Completa el formulario de pasajeros
   - Haz clic en "Pay with PayPal"
   - Completa el pago en el sandbox de PayPal
   - Verifica que recibas el email de confirmación
   - Descarga los PDFs (Confirmación + Recibo)

3. **Prueba de pago con Stripe (una vez configurado):**
   - Selecciona un vuelo
   - Completa el formulario
   - Usa una tarjeta de prueba de Stripe
   - Verifica email y PDFs

4. **Panel de administración:**
   - Ve a: `https://tu-sitio.replit.app/admin`
   - Contraseña: `Fenix1010@*`
   - Verifica que veas los pagos registrados

---

## 📊 Panel de Administración

### Acceso:
- **URL:** `/admin`
- **Contraseña:** `Fenix1010@*`

### Funcionalidades:
- ✅ Historial completo de pagos exitosos
- ✅ Filtros por fecha (todo, mes, día)
- ✅ Tracking de descargas de PDFs
- ✅ Analytics en tiempo real:
  - Total de pagos recibidos
  - Ingresos totales
  - Cantidad de pagos exitosos
  - Descargas de PDFs
- ✅ Visualización del método de pago usado (PayPal/Stripe)

---

## 🗄️ Estructura del Proyecto

```
workspace/
├── client/                    # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/        # Componentes reutilizables
│   │   ├── pages/            # Páginas de la app
│   │   ├── hooks/            # Custom hooks
│   │   └── lib/              # Utilidades
│   └── index.html
│
├── server/                    # Backend (Express + TypeScript)
│   ├── index.ts              # Punto de entrada
│   ├── routes.ts             # Rutas de la API
│   ├── db.ts                 # Configuración de base de datos
│   ├── amadeus.ts            # Cliente de Amadeus API
│   ├── pdfGenerator.ts       # Generación de PDFs
│   └── storage.ts            # Capa de abstracción de datos
│
├── shared/                    # Código compartido
│   └── schema.ts             # Esquemas de base de datos (Drizzle)
│
├── INSTRUCCIONES_PRODUCCION.md  # Este archivo
└── replit.md                 # Documentación del proyecto
```

---

## 🎯 Precios del Servicio

- **Precio por pasajero:** $15 USD
- **1 pasajero:** $15 USD
- **2 pasajeros:** $30 USD
- **3 pasajeros:** $45 USD
- Y así sucesivamente...

**Importante:**
- Los precios de vuelos mostrados son **informativos** (datos reales de Amadeus)
- El cobro real es SOLO el fee de servicio ($15 USD por pasajero)
- Los tickets se compran manualmente después del pago

---

## 📧 Sistema de Notificaciones por Email

El proyecto envía 3 tipos de emails automáticos:

1. **Quote Email:** Cuando alguien solicita una cotización
2. **Booking Notification:** Cuando alguien hace clic en "Continue to Payment"
3. **Payment Confirmation:** Cuando el pago se completa exitosamente (incluye links a PDFs)

Todos configurados en EmailJS con templates profesionales bilingües.

---

## 📄 Generación de PDFs

### 1. Booking Confirmation (Confirmación de Reserva)
- Diseño profesional estilo aerolínea
- Números de ticket IATA reales (usando códigos accounting como 451 para Porter, 016 para United)
- PNR en formato Amadeus (6 caracteres, sin 0/1)
- Detalles completos de todos los segmentos
- Información de pasajeros
- Asignación de asientos consecutivos en la misma columna
- Smart pagination (máximo 2 páginas)

### 2. Payment Receipt (Recibo de Pago)
- Desglose detallado del servicio
- Método de pago usado (PayPal/Stripe)
- Nota importante sobre el proceso de entrega
- Información de contacto

Ambos PDFs se generan automáticamente después de un pago exitoso y están disponibles para descarga inmediata.

---

## 🔒 Seguridad

### PDFs:
- ✅ Solo accesibles después de pago exitoso
- ✅ Verificación de `bookingId` en sessionStorage
- ✅ Redirección automática si no hay booking válido
- ✅ Todos los endpoints de prueba eliminados

### Pagos:
- ✅ Webhooks de Stripe/PayPal para verificar pagos
- ✅ Validación en servidor de todos los datos
- ✅ Secrets nunca expuestos en frontend

### Admin Panel:
- ✅ Protección por contraseña
- ✅ Solo lectura (no permite modificar datos)

---

## 🌐 Características Bilingües

Toda la interfaz está disponible en:
- 🇺🇸 **Inglés**
- 🇪🇸 **Español**

Incluyendo:
- Todas las páginas del sitio
- Emails de notificación
- PDFs generados
- Mensajes de error
- Panel de administración

El idioma se guarda en localStorage y persiste entre sesiones.

---

## ⚡ Tecnologías Utilizadas

### Frontend:
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS + shadcn/ui
- Wouter (routing)
- TanStack React Query (state management)
- React Hook Form + Zod (forms & validation)
- Stripe Elements + PayPal SDK (payments)

### Backend:
- Node.js + Express
- TypeScript (ESM modules)
- Drizzle ORM + PostgreSQL (Neon)
- PDFKit (PDF generation)
- Amadeus Production API (flight data)
- EmailJS (email notifications)

---

## 📞 Soporte

Si tienes algún problema durante la configuración:

1. **Verifica los logs del servidor:**
   - Ve a la consola de Replit
   - Busca mensajes de error en rojo

2. **Verifica que todas las variables estén configuradas:**
   - Pestaña "Secrets" en Replit
   - Todas las variables requeridas deben estar presentes

3. **Reinicia el servidor:**
   - Detén y vuelve a iniciar el workflow "Start application"

---

## ✨ Próximos Pasos Recomendados

1. ✅ **Publicar el sitio en Replit** (Deploy)
2. ✅ **Agregar credenciales de Stripe en producción**
3. ✅ **Hacer pruebas de pago con PayPal y Stripe**
4. ✅ **Verificar recepción de emails**
5. ✅ **Probar descarga de PDFs**
6. ✅ **Revisar panel de administración**
7. 🎯 **¡Lanzamiento!**

---

## 🎉 ¡Listo para Producción!

El proyecto está completamente funcional y listo para recibir usuarios reales. Solo necesitas agregar las claves de Stripe cuando tengas tu sitio publicado con HTTPS.

**PayPal ya funciona en producción y puedes empezar a recibir pagos inmediatamente.**

---

**Desarrollado con ❤️ para SkyBudgetFly**
**Versión:** 1.0.0 Production Ready
**Fecha:** Noviembre 2025
