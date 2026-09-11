/*
 * ANALÍTICA LOCAL DE COLOSO PLAY
 * Funciona sin cuenta externa. Los datos se guardan en el navegador del visitante.
 * Para convertirla en analítica global, configura COLOSO_ANALYTICS_ENDPOINT en el servidor;
 * nunca pongas claves privadas de una base de datos en este archivo.
 */
(() => {
    const STORAGE_KEY = 'colosoAnalytics';
    const leer = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { pageViews: 0, pages: {}, videos: {} }; } catch { return { pageViews: 0, pages: {}, videos: {} }; } };
    const guardar = data => localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    const enviar = event => {
        if (!window.COLOSO_ANALYTICS_ENDPOINT) return;
        fetch(window.COLOSO_ANALYTICS_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(event), keepalive: true }).catch(() => {});
    };
    const registrarPagina = () => {
        const data = leer(); const page = location.pathname.split('/').pop() || 'index.html';
        data.pageViews += 1; data.pages[page] = (data.pages[page] || 0) + 1; guardar(data);
        enviar({ type: 'page_view', page, occurredAt: new Date().toISOString() });
    };
    const registrarVideo = title => {
        const data = leer(); data.videos[title] = (data.videos[title] || 0) + 1; guardar(data);
        enviar({ type: 'video_view', title, occurredAt: new Date().toISOString() });
        return data.videos[title];
    };
    window.ColosoAnalytics = { registrarVideo, obtenerVideo: title => leer().videos[title] || 0, obtenerResumen: leer };
    document.addEventListener('DOMContentLoaded', registrarPagina, { once: true });
})();
