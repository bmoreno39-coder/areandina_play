/*
 * COLOso Play — Chat con IA (proxy serverless para Vercel).
 *
 * Aloja la clave secreta sk_ SOLO en la variable de entorno COLOSO_API_KEY
 * del panel de Vercel. El navegador nunca recibe la clave: le habla a este
 * endpoint /api/chat y este llama a Pollinations en el servidor.
 */

const COLOSO_SYSTEM = `Eres Coloso, la asistente virtual con IA oficial de COLOSO PLAY, la plataforma de streaming de la Fundación Universitaria del Área Andina (Areandina) en Colombia. Responde SIEMPRE en español, con tono amable, cercano y profesional, en 2-4 frases concisas. Conoce todo el sitio:
- Portada (index.html): hero con 6 anuncios (Graduación, Innovación, Docentes, Bienestar, Facultades, todas las facultades), buscador, filtros por modalidad/tipo/sede, carruseles de COMUNICACIONES, INNOVACIÓN, DOCENTES y BIENESTAR.
- Sección COMUNICACIONES: ceremonias de graduación por sede (Bogotá, Pereira, Valledupar, Virtuales) con videos.
- Sección INNOVACIÓN: Centro de Innovación Tecnológica, Capacitaciones Ceita, Parrilla 4.0.
- Sección DOCENTES: Espacios Virtuales/VR, Viernes de humanismo digital, Cátedra de pensamiento, Contenidos educativos.
- Sección BIENESTAR: bienestar universitario, salud mental, inducciones, permanencia.
- Facultades (canal.html): Ciencias Administrativas Económicas y Financieras, Ciencias de la Salud y del Deporte, Diseño Comunicación y Bellas Artes, Derecho, Educación, Ciencias Sociales y Humanas, Ingeniería y Ciencias Básicas; cada una con videos/carreras.
- Servicios y enlaces: Campus Virtual (campusvirtual.areandina.edu.co), Kactus (kactus.areandina.edu.co), correo institucional, calendarios académicos, consulta tu clase, postulación a grados.
- Radio Areandina en vivo incluida en la portada.
- Tema oscuro (botón 🌙/☀️) y panel de accesibilidad (♿: tamaño de letra, alto contraste, reducir animaciones).
- Contacto: Bogotá (601) 7449191, Pereira (606) 3401516, Valledupar (605) 5897879, línea gratuita 01 8000 18 0099.
Si te preguntan algo que no conoces, dilo con honestidad y ofrece ayuda sobre los temas del sitio. No inventes URLs ni datos.`;

const MAX_QUESTION_LENGTH = 500;
const MAX_MESSAGES = 10;

// Límite simple por IP (best-effort, en memoria). Evita abusos básicos.
const cache = new Map();
const limpiarCache = () => {
    const ahora = Date.now();
    for (const [ip, venc] of cache) if (venc < ahora) cache.delete(ip);
};
setInterval(limpiarCache, 60 * 1000).unref?.();

function dentroDelLimite(ip) {
    limpiarCache();
    const ahora = Date.now();
    const previo = cache.get(ip);
    if (previo && previo > ahora) return false;
    cache.set(ip, ahora + 30 * 1000);
    return true;
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

    const ip = (req.headers['x-forwarded-for'] || 'desconocido').split(',')[0].trim();

    let question = '';
    try {
        question = String(req.body?.question || '').trim();
    } catch {
        return res.status(400).json({ error: 'Cuerpo inválido' });
    }
    if (!question) return res.status(400).json({ error: 'Falta la pregunta' });
    if (question.length > MAX_QUESTION_LENGTH) return res.status(400).json({ error: 'Pregunta demasiado larga' });

    const apiKey = process.env.COLOSO_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'La clave de IA no está configurada en el servidor.' });
    }

    if (!dentroDelLimite(ip)) {
        return res.status(429).json({ error: 'Demasiadas peticiones. Espera unos segundos.' });
    }

    try {
        const response = await fetch('https://gen.pollinations.ai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: 'openai',
                messages: [
                    { role: 'system', content: COLOSO_SYSTEM },
                    { role: 'user', content: question }
                ],
                temperature: 0.7
            })
        });
        if (!response.ok) {
            const detalle = await response.text().catch(() => '');
            console.error(`Pollinations respondió ${response.status}: ${detalle.slice(0, 300)}`);
            return res.status(502).json({ error: `El proveedor de IA falló (${response.status})` });
        }
        const datos = await response.json();
        const texto = datos.choices?.[0]?.message?.content?.trim();
        if (!texto) return res.status(502).json({ error: 'El proveedor de IA no devolvió respuesta' });
        return res.status(200).json({ text: texto });
    } catch (error) {
        console.error('Error llamando a Pollinations:', error.message);
        return res.status(502).json({ error: 'No se pudo contactar el proveedor de IA' });
    }
};