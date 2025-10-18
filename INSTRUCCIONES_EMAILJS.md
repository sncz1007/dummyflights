# Guía de Configuración de EmailJS

Esta guía te ayudará a configurar la plantilla de notificación de reservas en EmailJS.

## Requisitos Previos

Ya deberías tener:
- Cuenta de EmailJS creada en https://dashboard.emailjs.com/
- Un servicio configurado (Gmail, Outlook, etc.)
- `VITE_EMAILJS_SERVICE_ID` y `VITE_EMAILJS_PUBLIC_KEY` ya configurados

## Paso 1: Crear Nueva Plantilla de Email

1. Ve a https://dashboard.emailjs.com/
2. Haz clic en **Email Templates** en la barra lateral izquierda
3. Haz clic en **Create New Template**
4. Dale un nombre: "Notificación de Reserva" (o el nombre que prefieras)
5. Copia el **Template ID** y guárdalo como `VITE_EMAILJS_BOOKING_TEMPLATE_ID` en tus variables de entorno

## Paso 2: Configurar el Contenido de la Plantilla

En el editor de plantillas, usa la siguiente configuración:

### Nombre de la Plantilla
```
Notificación de Reserva
```

### Asunto del Email
```
Nueva Reserva de Vuelo - {{flight_number}} - {{customer_name}}
```

### Cuerpo del Email (HTML)

Copia y pega esta plantilla HTML:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 {
            color: #dc2626;
            margin-top: 0;
            border-bottom: 3px solid #dc2626;
            padding-bottom: 10px;
        }
        h2 {
            color: #1f2937;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 8px;
            margin-top: 25px;
        }
        .section {
            margin: 20px 0;
            padding: 15px;
            background: #f9fafb;
            border-left: 4px solid #dc2626;
            border-radius: 4px;
        }
        .info-row {
            margin: 8px 0;
            padding: 5px 0;
        }
        .label {
            font-weight: bold;
            color: #4b5563;
            display: inline-block;
            width: 150px;
        }
        .value {
            color: #1f2937;
        }
        .price-section {
            background: #fef2f2;
            border-left-color: #16a34a;
        }
        .passenger-item {
            margin: 10px 0;
            padding: 10px;
            background: white;
            border-radius: 4px;
            border: 1px solid #e5e7eb;
        }
        .highlight {
            background: #fef3c7;
            padding: 2px 6px;
            border-radius: 3px;
            font-weight: bold;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            font-size: 12px;
            color: #6b7280;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🛫 Nueva Reserva de Vuelo</h1>
        
        <div class="section">
            <div class="info-row">
                <span class="label">Fecha de Reserva:</span>
                <span class="value">{{booking_date}}</span>
            </div>
            <div class="info-row">
                <span class="label">Idioma:</span>
                <span class="value">{{language}}</span>
            </div>
        </div>

        <h2>✈️ Información del Vuelo</h2>
        <div class="section">
            <div class="info-row">
                <span class="label">Aerolínea:</span>
                <span class="value highlight">{{airline}}</span>
            </div>
            <div class="info-row">
                <span class="label">Número de Vuelo:</span>
                <span class="value highlight">{{flight_number}}</span>
            </div>
            <div class="info-row">
                <span class="label">Ruta:</span>
                <span class="value">{{from_airport}} → {{to_airport}}</span>
            </div>
            <div class="info-row">
                <span class="label">Fecha de Salida:</span>
                <span class="value">{{departure_date}}</span>
            </div>
            <div class="info-row">
                <span class="label">Fecha de Regreso:</span>
                <span class="value">{{return_date}}</span>
            </div>
            <div class="info-row">
                <span class="label">Tipo de Viaje:</span>
                <span class="value">{{trip_type}}</span>
            </div>
            <div class="info-row">
                <span class="label">Clase:</span>
                <span class="value">{{flight_class}}</span>
            </div>
            <div class="info-row">
                <span class="label">Total Pasajeros:</span>
                <span class="value">{{passengers_count}}</span>
            </div>
        </div>

        <h2>👤 Pasajero Principal (Cliente)</h2>
        <div class="section">
            <div class="info-row">
                <span class="label">Nombre Completo:</span>
                <span class="value">{{customer_name}}</span>
            </div>
            <div class="info-row">
                <span class="label">Email:</span>
                <span class="value">{{customer_email}}</span>
            </div>
            <div class="info-row">
                <span class="label">Teléfono:</span>
                <span class="value">{{customer_phone}}</span>
            </div>
            <div class="info-row">
                <span class="label">Fecha de Nacimiento:</span>
                <span class="value">{{customer_dob}}</span>
            </div>
        </div>

        <h2>👥 Pasajeros Adicionales</h2>
        <div class="section">
            <pre style="white-space: pre-wrap; margin: 0; font-family: inherit;">{{additional_passengers}}</pre>
        </div>

        <h2>💰 Detalles de Precio</h2>
        <div class="section price-section">
            <div class="info-row">
                <span class="label">Precio Original:</span>
                <span class="value" style="text-decoration: line-through; color: #9ca3af;">{{original_price}}</span>
            </div>
            <div class="info-row">
                <span class="label">Descuento:</span>
                <span class="value" style="color: #16a34a; font-weight: bold;">{{discount}}</span>
            </div>
            <div class="info-row">
                <span class="label">Precio Total:</span>
                <span class="value" style="color: #16a34a; font-size: 20px; font-weight: bold;">{{total_price}}</span>
            </div>
        </div>

        <div class="footer">
            <p><strong>SkyBudgetFly</strong> - Sistema de Notificación de Reservas</p>
            <p>Esta es una notificación automática. Por favor procesa esta reserva y compra los boletos manualmente.</p>
        </div>
    </div>
</body>
</html>
```

## Paso 3: Verificar Variables de la Plantilla

Asegúrate de que las siguientes variables estén presentes en tu plantilla (EmailJS las mostrará en la barra lateral derecha):

### Información del Vuelo
- `airline` - Aerolínea
- `flight_number` - Número de vuelo
- `from_airport` - Aeropuerto de origen
- `to_airport` - Aeropuerto de destino
- `departure_date` - Fecha de salida
- `return_date` - Fecha de regreso
- `trip_type` - Tipo de viaje (ida y vuelta / solo ida)
- `flight_class` - Clase del vuelo
- `passengers_count` - Número de pasajeros

### Información del Cliente
- `customer_name` - Nombre del cliente
- `customer_email` - Email del cliente
- `customer_phone` - Teléfono del cliente
- `customer_dob` - Fecha de nacimiento del cliente

### Pasajeros Adicionales
- `additional_passengers` - Lista de pasajeros adicionales (ya formateada)

### Precios
- `total_price` - Precio total final
- `original_price` - Precio original (sin descuento)
- `discount` - Porcentaje de descuento

### Metadatos
- `language` - Idioma preferido (en/es)
- `booking_date` - Fecha y hora de la reserva

## Paso 4: Guardar y Probar

1. Haz clic en **Save** en el editor de plantillas
2. Usa el botón **Test** en EmailJS para enviar un email de prueba
3. Asegúrate de que recibes el email correctamente formateado

## Paso 5: Configuración de Variables de Entorno

Agrega el nuevo Template ID a tus variables de entorno:

```bash
VITE_EMAILJS_BOOKING_TEMPLATE_ID=tu_template_id_aqui
```

## ¿Cuándo se Envía el Email?

El email de notificación de reserva se envía **inmediatamente** cuando un cliente:
1. Llena su información de contacto
2. Agrega detalles de pasajeros adicionales (si aplica)
3. Hace clic en **"Continue to Payment"** (Continuar al Pago)

El email se envía **ANTES** de que se complete el pago, así recibes los detalles de la reserva tan pronto como el cliente se compromete a pagar.

## El Email Incluye

- ✈️ Detalles completos del vuelo (ruta, fechas, clase, aerolínea, número de vuelo)
- 👤 Información del pasajero principal (nombre, email, teléfono, fecha de nacimiento)
- 👥 Todos los pasajeros adicionales con sus nombres y fechas de nacimiento
- 💰 Desglose de precios (precio original, descuento, precio final)
- 🌐 Preferencia de idioma
- 📅 Marca de tiempo de la reserva

## Notas Importantes

- ✅ El email **NO** bloqueará el proceso de pago si falla al enviarse
- 🔍 Revisa la consola del navegador para ver errores de envío de email
- 📊 Asegúrate de tener cuota suficiente en EmailJS
- 📧 El email se envía a la dirección configurada en tu servicio de EmailJS (debería ser skybudgetfly@gmail.com)

## Cómo Funciona el Flujo Completo

1. 🔍 Cliente busca vuelos
2. ✈️ Cliente selecciona un vuelo y va al checkout
3. 📝 Cliente llena información de contacto
4. 👥 Cliente agrega detalles de pasajeros adicionales (si tiene más de 1 pasajero)
5. 🔘 Cliente hace clic en **"Continue to Payment"**
6. 📧 **Se envía email a tu correo inmediatamente** con todos los detalles de la reserva
7. 💳 Cliente continúa al formulario de pago
8. 🎫 Tú puedes comprar los boletos manualmente mientras el cliente completa el pago

## Ejemplo de Uso

Cuando recibas el email, verás algo como esto:

```
Nueva Reserva de Vuelo - AS123 - Juan Pérez

✈️ Información del Vuelo
Aerolínea: Alaska Airlines
Número de Vuelo: AS123
Ruta: JFK → LAX
Fecha de Salida: 2025-11-15
Fecha de Regreso: 2025-11-22
Tipo de Viaje: Round Trip
Clase: Economy
Total Pasajeros: 2

👤 Pasajero Principal
Nombre: Juan Pérez
Email: juan@example.com
Teléfono: +1 555-0123
Fecha de Nacimiento: 1990-05-15

👥 Pasajeros Adicionales
2. María Pérez - DOB: 1992-08-20

💰 Detalles de Precio
Precio Original: $800.00
Descuento: 40%
Precio Total: $480.00
```

¡El sistema está listo para usar una vez que configures la plantilla de EmailJS siguiendo estas instrucciones!
