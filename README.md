# Coloso Play

## Chatbot

La clave del chatbot se guarda sólo en las variables de entorno de Vercel, nunca en el navegador ni en el repositorio:

- `COLOSO_API_KEY`: clave del proveedor configurado actualmente.
- `COLOSO_MODEL` (opcional): permite cambiar el modelo sin editar el código. Si no existe, se usa `openai/gpt-4o-mini`.

El endpoint tiene un tiempo máximo de 20 segundos y reintenta una vez los errores temporales. Si el proveedor continúa sin responder, el chat muestra respuestas locales sobre el sitio para que la persona no quede sin ayuda.

Después de cambiar una variable en Vercel, realiza un redeploy. No subas un archivo `.env` al repositorio.
