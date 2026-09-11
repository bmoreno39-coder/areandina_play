/*
 * COLOSO PLAY — CÓDIGO DE LA PORTADA
 *
 * Guía rápida para editar:
 * 1. CONTENIDO: modifica los arreglos FACULTADES y VIDEOS_PORTADA. - IMPORTANTE SANTI PARA QUE NO SE PIERDA CUANDO EDITE LOL
 * 2. COMPONENTES: cada función crear... dibuja una parte de la página. - IMPORTANTE SANTI PARA QUE NO SE PIERDA CUANDO EDITE LOL
 * 3. INICIALIZACIÓN: iniciarAplicacion activa todo una única vez. - IMPORTANTE SANTI PARA QUE NO SE PIERDA CUANDO EDITE LOL
 */

/* ===== 1. CONTENIDO EDITABLE ===== */
const FACULTADES = [
    ['Ciencias Administrativas, Económicas y Financieras', 'imagenes/cafe.png', 'administrativas'],
    ['Ciencias de la Salud y del Deporte', 'imagenes/CIENCIAS DE LA SALUD Y DEL DEPORTE.png', 'salud'],
    ['Diseño, Comunicación y Bellas Artes', 'imagenes/COMUNICACIÓN Y BELLAS ARTES.png', 'diseno'],
    ['Derecho', 'imagenes/DERECHO.png', 'derecho'],
    ['Educación', 'imagenes/EDUCACIÓN.png', 'educacion'],
    ['Ciencias Sociales y Humanas', 'imagenes/CIENCIAS SOCIALES Y HUMANAS.png', 'sociales'],
    ['Ingeniería y Ciencias Básicas', 'imagenes/ingenieriaa y ciencias básicas.png', 'ingenieria']
];

const VIDEOS_PORTADA = {
    COMUNICACIONES: [['GRADOS BOGOTÁ', '12SlFTXScQc']],
    innovacion: [['Capacitación Ceita 1', 'Ar42N3JKTpU'], ['Capacitación Ceita 2', 'JRv_2TJKWNo'], ['Capacitación Ceita 3', 'Jp4PXRk76i8']],
    realidades: [['Recorrido VR', 'DkiDGwy8vGM']],
    bienestar: [['Bienestar universitario', 'nOJ8n0_IXus']]
};

const RUTAS_SECCION = { COMUNICACIONES: 'COMUNICACIONES', innovacion: 'innovacion', bienestar: 'bienestar', realidades: 'realidades' };

/* ===== 2. UTILIDADES ===== */
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function crearElemento(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
}

function abrirVideo(url, title = 'Video') {
    const modal = $('#videoModal');
    const frame = $('#videoIframe');
    if (!modal || !frame) return;
    $('#videoTitle').textContent = title;
    frame.src = url;
    modal.style.display = 'flex';
}

function cerrarVideo() {
    const modal = $('#videoModal');
    const frame = $('#videoIframe');
    if (frame) frame.src = '';
    if (modal) modal.style.display = 'none';
}

/* ===== 3. TARJETAS Y CARRUSELES ===== */
function crearTarjetaFacultad([nombre, imagen, id]) {
    const card = crearElemento('a', 'facultad-card');
    card.href = `canal.html?tipo=facultad&id=${encodeURIComponent(id)}`;
    const picture = document.createElement('img');
    picture.src = imagen;
    picture.alt = nombre;
    picture.className = 'facultad-thumb';
    picture.loading = 'lazy';
    card.append(picture, crearElemento('div', 'facultad-name', `🎓 ${nombre}`));
    return card;
}

function crearTarjetaVideo([titulo, id]) {
    const card = crearElemento('article', 'video-card');
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    const abrir = () => abrirVideo(`https://www.youtube-nocookie.com/embed/${id}?rel=0`, titulo);
    card.addEventListener('click', abrir);
    card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); abrir(); } });
    const thumb = crearElemento('div', 'video-thumb-container');
    const image = document.createElement('img');
    image.src = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
    image.alt = `Miniatura: ${titulo}`;
    image.className = 'video-thumb';
    image.loading = 'lazy';
    thumb.append(image);
    const info = crearElemento('div', 'video-info');
    info.append(crearElemento('div', 'video-title', titulo), crearElemento('div', 'video-meta', '📺 Ver video'));
    card.append(thumb, info);
    return card;
}

function poblarCarrusel(trackId, items, crearTarjeta) {
    const track = $(`#${trackId}`);
    if (!track) return;
    const fragment = document.createDocumentFragment();
    items.forEach(item => fragment.append(crearTarjeta(item)));
    track.replaceChildren(fragment);
}

function activarBotonesCarrusel() {
    $$('.carousel-container').forEach(container => {
        if (container.dataset.ready) return;
        container.dataset.ready = 'true';
        const track = $('.carousel-track', container);
        if (!track) return;
        [['left', -320, 'Anterior'], ['right', 320, 'Siguiente']].forEach(([side, distance, label]) => {
            const button = crearElemento('button', `carousel-btn ${side}`, side === 'left' ? '❮' : '❯');
            button.type = 'button'; button.ariaLabel = label;
            button.addEventListener('click', () => track.scrollBy({ left: distance, behavior: 'smooth' }));
            container.append(button);
        });
    });
}

/* ===== 4. INTERACCIONES ===== */
function iniciarHero() {
    const slides = $('#heroSlides'); const dots = $('#heroDots');
    if (!slides || !dots) return;
    const total = $$('.hero-slide', slides).length;
    let actual = 0; let timer;
    const mostrar = index => {
        actual = (index + total) % total;
        slides.style.transform = `translateX(-${actual * 100}%)`;
        $$('.dot', dots).forEach((dot, i) => dot.classList.toggle('active', i === actual));
    };
    for (let i = 0; i < total; i += 1) { const dot = crearElemento('button', 'dot'); dot.type = 'button'; dot.ariaLabel = `Ir al anuncio ${i + 1}`; dot.addEventListener('click', () => { mostrar(i); reiniciar(); }); dots.append(dot); }
    const reiniciar = () => { window.clearInterval(timer); timer = window.setInterval(() => mostrar(actual + 1), 6000); };
    mostrar(0); reiniciar();
}

function iniciarTema() {
    const button = $('#themeToggle'); if (!button) return;
    const oscuro = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark-mode', oscuro); button.textContent = oscuro ? '☀️' : '🌙';
    button.addEventListener('click', () => { const activo = document.body.classList.toggle('dark-mode'); localStorage.setItem('darkMode', activo); button.textContent = activo ? '☀️' : '🌙'; });
}

function iniciarNavegacion() {
    const rutas = { navInicio: 'index.html', navCOMUNICACIONES: 'seccion.html?seccion=COMUNICACIONES', navInnovacion: 'seccion.html?seccion=innovacion', navBienestar: 'seccion.html?seccion=bienestar', navRealidades: 'seccion.html?seccion=realidades' };
    Object.entries(rutas).forEach(([id, href]) => { const link = $(`#${id}`); if (link) { link.href = href; } });
    $$('#dropdownFacultades a').forEach(link => { link.href = `canal.html?tipo=facultad&id=${encodeURIComponent(link.dataset.id)}`; });
    $('#logoLink')?.addEventListener('click', () => { window.location.href = 'index.html'; });
}

function iniciarModal() {
    $('#closeModal')?.addEventListener('click', cerrarVideo);
    $('#videoModal')?.addEventListener('click', event => { if (event.target.id === 'videoModal') cerrarVideo(); });
    $('#fullscreenBtn')?.addEventListener('click', () => $('#videoIframe')?.requestFullscreen?.());
    $('#cerrarBanner')?.addEventListener('click', () => $('#miModal')?.remove());
    $('#miModal')?.addEventListener('click', event => { if (event.target.id === 'miModal') event.currentTarget.remove(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') { cerrarVideo(); $('#miModal')?.remove(); } });
}

/* ===== 5. SERVICIOS PARA ESTUDIANTES ===== */
function iniciarRadio() {
    const audio = $('#radioMiniAudio'); const play = $('#playPauseMiniBtn');
    const volume = $('#volumeSliderRadio'); const volumeButton = $('#volumeBtnRadio');
    const label = $('#radioSongName');
    if (!audio || !play || !volume || !volumeButton) return;
    audio.src = 'https://servidor24-1.brlogic.com:7030/live?source=website';
    audio.volume = Number(volume.value) / 100;
    play.addEventListener('click', async () => {
        try {
            if (audio.paused) { await audio.play(); play.textContent = '⏸'; if (label) label.textContent = '🎧 Escuchando en vivo'; }
            else { audio.pause(); play.textContent = '▶'; if (label) label.textContent = 'Areandina Radio'; }
        } catch { if (label) label.textContent = '⚠️ Radio no disponible'; }
    });
    volume.addEventListener('input', () => { audio.volume = Number(volume.value) / 100; volumeButton.textContent = audio.volume === 0 ? '🔇' : audio.volume < .3 ? '🔈' : '🔊'; });
    volumeButton.addEventListener('click', () => { audio.muted = !audio.muted; volumeButton.textContent = audio.muted ? '🔇' : '🔊'; });
    audio.addEventListener('error', () => { play.textContent = '▶'; if (label) label.textContent = '⚠️ Radio no disponible'; });
}

function respuestaAyuda(pregunta) {
    const texto = pregunta.toLowerCase();
    if (texto.includes('campus') || texto.includes('aula virtual')) return 'Puedes ingresar al Campus Virtual desde Accesos directos. Usa tus credenciales institucionales.';
    if (texto.includes('grado')) return 'Consulta la sección Comunicaciones y usa el enlace Postulación a Grados en Accesos directos.';
    if (texto.includes('bienestar')) return 'En la sección Bienestar encontrarás contenidos de acompañamiento y vida universitaria.';
    return 'Puedo orientarte sobre Campus Virtual, grados, bienestar y los contenidos de Coloso Play.';
}

function iniciarChat() {
    const chat = $('#studentChat'); const form = $('#studentChatForm'); const input = $('#studentChatInput'); const messages = $('#studentChatMessages');
    if (!chat || !form || !input || !messages) return;
    $('#mascota')?.addEventListener('click', () => { chat.hidden = false; input.focus(); });
    $('#studentChatClose')?.addEventListener('click', () => { chat.hidden = true; });
    const responder = pregunta => { const message = crearElemento('div', 'chat-message assistant', respuestaAyuda(pregunta)); messages.append(message); messages.scrollTop = messages.scrollHeight; };
    form.addEventListener('submit', event => { event.preventDefault(); const pregunta = input.value.trim(); if (!pregunta) return; messages.append(crearElemento('div', 'chat-message user', pregunta)); input.value = ''; responder(pregunta); });
    $$('.student-chat-suggestions button').forEach(button => button.addEventListener('click', () => { input.value = button.textContent; form.requestSubmit(); }));
}

function iniciarAccesibilidad() {
    const trigger = $('#accessibilityTrigger'); const panel = $('#accessibilityPanel');
    if (!trigger || !panel) return;
    let settings;
    try { settings = JSON.parse(localStorage.getItem('a11ySettings') || '{"fontSize":100,"contrast":false,"motion":false}'); }
    catch { settings = { fontSize: 100, contrast: false, motion: false }; }
    const aplicar = () => { document.documentElement.style.fontSize = `${settings.fontSize}%`; document.body.classList.toggle('high-contrast', settings.contrast); document.body.classList.toggle('a11y-reduce-motion', settings.motion); localStorage.setItem('a11ySettings', JSON.stringify(settings)); };
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
    $('#accessibilityClose')?.addEventListener('click', () => { ocultarPanel(); trigger.focus(); });
    $$('[data-a11y-action]').forEach(button => button.addEventListener('click', () => {
        const action = button.dataset.a11yAction;
        if (action === 'font-increase') settings.fontSize = Math.min(130, settings.fontSize + 10);
        if (action === 'font-decrease') settings.fontSize = Math.max(90, settings.fontSize - 10);
        if (action === 'contrast') settings.contrast = !settings.contrast;
        if (action === 'motion') settings.motion = !settings.motion;
        if (action === 'read') { speechSynthesis.cancel(); speechSynthesis.speak(new SpeechSynthesisUtterance(document.body.innerText.slice(0, 10000))); return; }
        if (action === 'stop-read') { speechSynthesis.cancel(); return; }
        aplicar();
    }));
    $('#accessibilityReset')?.addEventListener('click', () => { Object.assign(settings, { fontSize: 100, contrast: false, motion: false }); aplicar(); });
}

/* ===== 6. INICIO ÚNICO ===== */
function iniciarAplicacion() {
    poblarCarrusel('facultadesTrack', FACULTADES, crearTarjetaFacultad);
    Object.entries(VIDEOS_PORTADA).forEach(([seccion, videos]) => poblarCarrusel(`${seccion}Track`, videos, crearTarjetaVideo));
    activarBotonesCarrusel(); iniciarHero(); iniciarTema(); iniciarNavegacion(); iniciarModal(); iniciarRadio(); iniciarChat(); iniciarAccesibilidad();
}


document.addEventListener('DOMContentLoaded', iniciarAplicacion, { once: true });
