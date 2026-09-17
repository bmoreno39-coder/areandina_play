/* COLOSO CHAT — Asistente con IA compartida en todas las páginas.
 * Autónomo: no depende de app.js/seccion.js/canal.js.
 * La IA la procesa un servidor (endpoint /api/chat en Vercel) para que la
 * clave secreta nunca viaje al navegador. Si el servidor falla, responde
 * con conocimiento local.
 */
(function () {
    'use strict';
    /* URL del servidor de IA (endpoint /api/chat).
     * En Vercel va vacío: se usa la ruta relativa del mismo sitio.
     * Si el frontend se publica en OTRO dominio (p. ej. un servidor de la
     * universidad), pon aquí la URL completa de tu proyecto en Vercel:
     *   const SERVIDOR_IA = 'https://tu-proyecto.vercel.app/api/chat';
     */
    const SERVIDOR_IA = '';
    const $c = selector => document.querySelector(selector);
    const $$c = selector => [...document.querySelectorAll(selector)];
    const crearElemento = (tag, className, text) => {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (text) element.textContent = text;
        return element;
    };

    /* Renderiza Markdown simple (negrita, cursiva, subrayado y enlaces) de forma segura:
     * primero se escapan los caracteres HTML y luego se aplican los formatos con regex. */
    const renderizarMarkdown = texto => {
        const escapar = str => str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
        return escapar(texto)
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/__(.+?)__/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
            .replace(/\n/g, '<br>');
    };

    /* Conocimiento local de Coloso Play (respaldo sin conexión o sin clave) */
    const CONOCIMIENTO_COLOSO = {
        campus: { palabras: ['campus', 'aula', 'virtual'], respuesta: 'Ingresa al Campus Virtual desde Accesos directos (https://campusvirtual.areandina.edu.co/). Usa tus credenciales institucionales. También puedes entrar vía Kactus (https://kactus.areandina.edu.co/).' },
        grados: { palabras: ['grado', 'graduación', 'graduacion', 'ceremonia', 'ceremonias', 'postular'], respuesta: 'Las ceremonias de graduación están en la sección 🎓 COMUNICACIONES (Bogotá, Pereira, Valledupar y Virtuales). Para postularte, usa el enlace Postulación a Grados en Accesos directos.' },
        bienestar: { palabras: ['bienestar', 'apoyo', 'salud mental', 'permanencia', 'inducción', 'induccion'], respuesta: 'En la sección ❤️ BIENESTAR UNIVERSITARIO encontrarás contenidos de acompañamiento, salud mental, inducciones y vida universitaria.' },
        innovacion: { palabras: ['innovación', 'innovacion', 'ceita', 'parrilla', 'tecnológica', 'tecnologica'], respuesta: 'El Centro de Innovación Tecnológica está en la sección 💡 INNOVACIÓN: Capacitaciones Ceita y programa Parrilla 4.0.' },
        docentes: { palabras: ['docente', 'docentes', 'realidades', 'espacios virtuales', 'cátedra', 'catedra', 'humanismo'], respuesta: 'La sección 🧑🏫 DOCENTES incluye Espacios Virtuales (VR), Viernes de humanismo digital, Cátedra de pensamiento y Contenidos Educativos.' },
        facultades: { palabras: ['facultad', 'facultades', 'carrera', 'carreras', 'programa', 'programas', 'administrativas', 'salud', 'derecho', 'educación', 'educacion', 'sociales', 'ingeniería', 'ingenieria', 'diseño', 'comunicación'], respuesta: 'Las 7 facultades son: Ciencias Administrativas Económicas y Financieras, Ciencias de la Salud y del Deporte, Diseño Comunicación y Bellas Artes, Derecho, Educación, Ciencias Sociales y Humanas, e Ingeniería y Ciencias Básicas. Explóralas en el home o en las tarjetas de facultades.' },
        radio: { palabras: ['radio', 'música', 'musica', 'en vivo', 'en directo'], respuesta: 'Areandina Radio se escucha en vivo desde el reproductor de la página (icono de radio). Dale ▶ al botón de reproducción.' },
        contacto: { palabras: ['teléfono', 'telefono', 'contacto', 'llamar', 'conmutador', 'sede', 'bogotá', 'pereira', 'valledupar'], respuesta: 'Sedes: Bogotá (601) 7449191, Pereira (606) 3401516, Valledupar (605) 5897879. Línea gratuita: 01 8000 18 0099.' },
        oscuro: { palabras: ['oscuro', 'dark', 'claro', 'modo', 'tema'], respuesta: 'Usa el botón 🌙/☀️ del encabezado para alternar el tema oscuro o claro. Tu preferencia se guarda automáticamente.' },
        accesibilidad: { palabras: ['accesibilidad', 'contraste', 'letra', 'accesible', 'daltonismo'], respuesta: 'El botón ♿ Accesibilidad permite ajustar el tamaño de letra, el alto contraste y reducir animaciones para facilitar la lectura.' },
        buscar: { palabras: ['buscar', 'cómo encuentro', 'como encuentro', 'listado', 'directorio'], respuesta: 'Usa la barra de búsqueda 🔍 del encabezado para encontrar videos y contiene una sugerencia para cada facultatividad. También puedes usar los filtros de modalidad, tipo y sede.' },
        quees: { palabras: ['qué es', 'que es', 'coloso', 'qué hace', 'plataforma'], respuesta: 'Coloso Play es la plataforma de streaming de la Fundación Universitaria del Área Andina. Aquí encuentras ceremonias de grado, capacitaciones, espacios virtuales y contenidos de bienestar y académicos.' }
    };

    function respuestaBase(pregunta) {
        const texto = pregunta.toLowerCase();
        const regla = Object.values(CONOCIMIENTO_COLOSO).find(regla => regla.palabras.some(p => texto.includes(p)));
        return regla ? regla.respuesta : 'Puedo orientarte sobre Campus Virtual, grados, bienestar, innovación, facultades, radio y los contenidos de Coloso Play. Escribe tu consulta, por ejemplo "¿cómo ingreso al Campus Virtual?"';
    }

    async function responderColosoIA(pregunta) {
        const respuesta = await fetch(SERVIDOR_IA || '/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: pregunta })
        });
        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
        const datos = await respuesta.json();
        return datos.text || null;
    }

    function iniciarChat() {
        const chat = $c('#studentChat'); const form = $c('#studentChatForm'); const input = $c('#studentChatInput'); const messages = $c('#studentChatMessages');
        if (!chat || !form || !input || !messages) return;
        const estadoIA = $c('#chatEstadoIA');
        const agregarMensaje = (texto, tipo) => {
            const bubble = crearElemento('div', `chat-message ${tipo} message-enter`);
            if (tipo === 'assistant') bubble.innerHTML = renderizarMarkdown(texto);
            else bubble.textContent = texto;
            messages.append(bubble);
            messages.scrollTop = messages.scrollHeight;
        };
        const mostrarEscribiendo = activo => {
            let indicador = messages.querySelector('.chat-typing');
            if (activo && !indicador) {
                indicador = crearElemento('div', 'chat-typing message-enter');
                indicador.append(crearElemento('span'), crearElemento('span'), crearElemento('span'));
                messages.append(indicador);
            } else if (!activo && indicador) {
                indicador.remove();
            }
            messages.scrollTop = messages.scrollHeight;
        };
        const actualizarEstadoIA = () => {
            if (estadoIA) estadoIA.textContent = 'IA conectada (servidor)';
        };
        actualizarEstadoIA();
        $c('#mascota')?.addEventListener('click', () => {
            chat.hidden = false;
            chat.classList.remove('chat-opening');
            void chat.offsetWidth;
            chat.classList.add('chat-opening');
            input.focus();
        });
        $c('#studentChatClose')?.addEventListener('click', () => { chat.hidden = true; });
        const responder = async pregunta => {
            form.classList.add('is-sending');
            mostrarEscribiendo(true);
            try {
                const texto = await responderColosoIA(pregunta);
                mostrarEscribiendo(false);
                if (texto) { agregarMensaje(texto, 'assistant'); form.classList.remove('is-sending'); return; }
            } catch { /* cae al respaldo */ }
            window.setTimeout(() => {
                mostrarEscribiendo(false);
                agregarMensaje(respuestaBase(pregunta), 'assistant');
                form.classList.remove('is-sending');
            }, 700 + Math.random() * 500);
        };
        form.addEventListener('submit', event => { event.preventDefault(); const pregunta = input.value.trim(); if (!pregunta) return; agregarMensaje(pregunta, 'user'); input.value = ''; responder(pregunta); });
        $$c('.student-chat-suggestions button').forEach(button => button.addEventListener('click', () => { input.value = button.textContent; form.requestSubmit(); }));
    }

    document.addEventListener('DOMContentLoaded', iniciarChat, { once: true });

    /* ===== Accesibilidad ♿ (compartida en todas las páginas) ===== */
    const iniciarAccesibilidad = () => {
        const trigger = $c('#accessibilityTrigger');
        const panel = $c('#accessibilityPanel');
        if (!trigger || !panel) return;
        let settings;
        const DEFAULTS = { fontSize: 100, contrast: false, motion: false, links: false, spacing: false };
        try { settings = { ...DEFAULTS, ...JSON.parse(localStorage.getItem('a11ySettings') || '{}') }; }
        catch { settings = { ...DEFAULTS }; }
        const aplicar = () => {
            document.documentElement.style.fontSize = settings.fontSize + '%';
            document.body.classList.toggle('high-contrast', settings.contrast);
            document.body.classList.toggle('a11y-reduce-motion', settings.motion);
            document.body.classList.toggle('a11y-links', settings.links);
            document.body.classList.toggle('a11y-spacing', settings.spacing);
            localStorage.setItem('a11ySettings', JSON.stringify(settings));
            $$c('[data-a11y-action]').forEach(btn => {
                const action = btn.dataset.a11yAction;
                if (['contrast', 'motion', 'links', 'spacing'].includes(action)) btn.setAttribute('aria-pressed', String(!!settings[action]));
            });
        };
        aplicar();
        const mostrarPanel = () => {
            panel.hidden = false;
            panel.classList.remove('is-open');
            requestAnimationFrame(() => panel.classList.add('is-open'));
            trigger.setAttribute('aria-expanded', 'true');
        };
        const ocultarPanel = () => {
            panel.classList.remove('is-open');
            trigger.setAttribute('aria-expanded', 'false');
            window.setTimeout(() => { if (!panel.classList.contains('is-open')) panel.hidden = true; }, 220);
        };
        trigger.addEventListener('click', () => panel.hidden ? mostrarPanel() : ocultarPanel());
        $c('#accessibilityClose')?.addEventListener('click', () => { ocultarPanel(); trigger.focus(); });
        $$c('[data-a11y-action]').forEach(button => button.addEventListener('click', () => {
            const action = button.dataset.a11yAction;
            if (action === 'font-increase') settings.fontSize = Math.min(130, settings.fontSize + 10);
            if (action === 'font-decrease') settings.fontSize = Math.max(90, settings.fontSize - 10);
            if (action === 'contrast') settings.contrast = !settings.contrast;
            if (action === 'links') settings.links = !settings.links;
            if (action === 'motion') settings.motion = !settings.motion;
            if (action === 'spacing') settings.spacing = !settings.spacing;
            if (action === 'read') { speechSynthesis.cancel(); speechSynthesis.speak(new SpeechSynthesisUtterance(document.body.innerText.slice(0, 10000))); return; }
            if (action === 'stop-read') { speechSynthesis.cancel(); return; }
            aplicar();
        }));
        $c('#accessibilityReset')?.addEventListener('click', () => { settings = { ...DEFAULTS }; aplicar(); });
    };

    document.addEventListener('DOMContentLoaded', iniciarAccesibilidad, { once: true });
})();