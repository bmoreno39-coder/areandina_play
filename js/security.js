/* Seguridad del lado del navegador: elimina manejadores inline heredados de tarjetas de video. */
(() => {
    const normalizarTarjeta = card => {
        if (card.dataset.secureReady) return;
        const raw = card.getAttribute('onclick') || '';
        const match = raw.match(/reproducirVideo\('([^']+)'(?:,\s*'([^']*)')?\)/);
        if (!match) return;
        card.dataset.secureReady = 'true';
        card.removeAttribute('onclick');
        card.addEventListener('click', event => {
            if (event.target.closest('button')) return;
            window.reproducirVideo?.(match[1], match[2] || 'Video');
        });
        card.querySelectorAll('[onclick]').forEach(button => button.removeAttribute('onclick'));
    };
    const normalizar = root => root.querySelectorAll?.('.video-card[onclick], .presentacion-card[onclick]').forEach(normalizarTarjeta);
    document.addEventListener('DOMContentLoaded', () => { normalizar(document); new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(node => { if (node.nodeType === 1) { normalizar(node); if (node.matches?.('.video-card[onclick], .presentacion-card[onclick]')) normalizarTarjeta(node); } }))).observe(document.body, { childList: true, subtree: true }); }, { once: true });
})();
