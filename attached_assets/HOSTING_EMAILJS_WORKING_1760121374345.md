# SkyBudget - Instrucciones de Hosting (EmailJS Funcional)

## Archivos para Subir al Servidor
Descomprime `skybudget-website-emailjs-working.tar.gz` y sube todo el contenido a tu carpeta **public** del servidor.

**IMPORTANTE:** Este archivo incluye EmailJS configurado y funcionando + datos de aeropuertos integrados.

## Contenido del Archivo
```
skybudget-website-emailjs-working.tar.gz
├── index.html (página principal)
├── assets/
│   ├── index-BpCQUvPU.js (JavaScript con EmailJS configurado + aeropuertos)
│   ├── index-DnZgqlQt.css (CSS compilado con Tailwind)
│   ├── IMG_9390_1754454830511-Cjy8jh9W.jpeg (Logo SkyBudget)
│   └── ChatGPT Image 4 ago 2025_ 04_57_45 p.m._1754453448045-DxTXx4sD.png (Imagen hero)
├── robots.txt (SEO para motores de búsqueda)
└── sitemap.xml (Mapa del sitio para Google)
```

## Características Incluidas
✅ **Sitio Completamente Bilingüe** (Inglés/Español - Inglés por defecto)
✅ **Navegación Funcional** - Menú y footer funcionan en todas las páginas
✅ **Formulario de Cotización** - EmailJS configurado y funcionando
✅ **Emails a skybudgetfly@gmail.com** - Configuración EmailJS incluida
✅ **Búsqueda de Aeropuertos** - 500+ aeropuertos integrados (funciona sin backend)
✅ **Responsive Design** - Funciona en móviles, tablets y desktop
✅ **SEO Optimizado** - Meta tags, Open Graph, Schema.org
✅ **Páginas de Términos y Privacidad** - Completamente traducidas

## Variables de Entorno Requeridas
Configura estas variables en tu panel de hosting:

```
VITE_EMAILJS_PUBLIC_KEY=tu_public_key_emailjs
VITE_EMAILJS_SERVICE_ID=tu_service_id_emailjs  
VITE_EMAILJS_TEMPLATE_ID=tu_template_id_emailjs
```

**IMPORTANTE:** Sin estas variables, el formulario no enviará emails.

## Instrucciones de Subida
1. **Extrae el archivo:** `tar -xzf skybudget-website-emailjs-working.tar.gz`
2. **Sube todo el contenido** a tu carpeta `public/` del servidor
3. **Configura las 3 variables de entorno EmailJS** en tu panel de hosting
4. **Verifica que funcione** accediendo a tu dominio y probando el formulario

## Configuración EmailJS
Para obtener las variables de entorno:

1. **Ve a EmailJS.com** y crea/inicia sesión en tu cuenta
2. **Crea un servicio** conectado a Gmail
3. **Crea un template** para recibir las cotizaciones
4. **Copia las 3 claves** (Public Key, Service ID, Template ID)
5. **Configúralas** en tu hosting

## Verificación Final
- ✅ Sitio carga correctamente
- ✅ Navegación funciona entre páginas
- ✅ Búsqueda de aeropuertos encuentra ciudades
- ✅ Formulario envía emails a skybudgetfly@gmail.com
- ✅ Mensajes bilingües funcionan (botón de idioma)

## Soporte
Email: skybudgetfly@gmail.com
Sitio compilado: Agosto 11, 2025