# Seguridad y analítica de Coloso Play

## Protecciones implementadas

- **Política de seguridad de contenido (CSP):** solo permite recursos del sitio y de los proveedores necesarios (Google Fonts, YouTube y medios HTTPS). Bloquea plugins, cambios de base y formularios hacia destinos no autorizados.
- **Sin JavaScript incrustado en los HTML:** la lógica vive en `js/`. Esto reduce la superficie de ataques XSS y facilita auditorías.
- **Manejadores heredados de video normalizados:** `js/security.js` reemplaza los `onclick` generados por las tarjetas con listeners controlados.
- **Protección de enlaces externos:** los enlaces en nuevas pestañas incluyen `rel="noopener noreferrer"`, evitando que una página externa controle la pestaña original.
- **Política de referencia:** el navegador solo comparte el origen, no la ruta completa, al visitar sitios externos.
- **Iframes restringidos:** únicamente se permiten reproductores de YouTube declarados en la CSP.
- **Sin secretos en el navegador:** no hay contraseñas, claves privadas ni credenciales de base de datos en el repositorio.

## Contadores actuales

`js/analytics.js` registra visitas de página y reproducciones de video en el navegador mediante `localStorage`. Esto funciona de inmediato, pero representa la actividad de cada visitante de forma local; no suma aún todos los usuarios en un panel central.

## Para habilitar conteos globales

Se recomienda Supabase con una función de servidor o endpoint propio. El navegador enviaría únicamente eventos mínimos (`page_view`, `video_view`, fecha y nombre del video) al endpoint configurado como `COLOSO_ANALYTICS_ENDPOINT`.

Reglas obligatorias para producción:

1. Nunca publicar una clave `service_role`, contraseña o acceso directo a la base en JavaScript.
2. Activar Row Level Security (RLS) en Supabase.
3. Permitir al sitio público solo insertar eventos validados; leer reportes debe requerir inicio de sesión administrativo.
4. Limitar frecuencia por IP/sesión en el endpoint para evitar visitas falsas.
5. Guardar datos agregados o seudonimizados; no recopilar nombres, correos ni direcciones IP si no existe base legal y política de privacidad.
6. Configurar en el servidor los encabezados `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` o `frame-ancestors 'none'`, `Permissions-Policy` y HSTS. Estos encabezados no se pueden garantizar solo desde archivos estáticos.

## Punto pendiente de despliegue

La CSP actual conserva `style-src 'unsafe-inline'` porque el diseño heredado todavía contiene estilos HTML en línea. El siguiente endurecimiento recomendado es migrar esos estilos a CSS y retirar esa excepción.
