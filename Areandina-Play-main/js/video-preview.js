/* Vista previa silenciosa: usa data-preview-url de cada tarjeta de video. */
(() => {
    const DELAY_MS = 350;

    function crearEtiqueta() {
        const label = document.createElement('span');
        label.textContent = 'Vista previa';
        return label;
    }

    function obtenerUrlPreview(card) {
        if (card.dataset.previewUrl) return card.dataset.previewUrl;
        const match = (card.getAttribute('onclick') || '').match(/reproducirVideo\('([^']+)'/);
        if (!match || !/youtu\.be|youtube\.com/.test(match[1])) return '';
        const url = new URL(match[1]);
        const id = url.searchParams.get('v') || url.pathname.split('/').filter(Boolean).pop();
        return id ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&controls=0&playsinline=1&rel=0` : '';
    }

    function activarPreview(card) {
        const previewUrl = obtenerUrlPreview(card);
        if (card.dataset.previewReady || !previewUrl) return;
        card.dataset.previewReady = 'true';
        const target = card.querySelector('.video-thumb-container');
        if (!target) return;
        let timer;
        const retirar = () => { window.clearTimeout(timer); card.classList.remove('is-previewing'); target.querySelector('.video-hover-preview')?.remove(); };
        card.addEventListener('mouseenter', () => {
            timer = window.setTimeout(() => {
                const preview = document.createElement('div');
                preview.className = 'video-hover-preview';
                const frame = document.createElement('iframe');
                frame.src = previewUrl;
                frame.title = 'Vista previa del video';
                frame.tabIndex = -1;
                frame.allow = 'autoplay; encrypted-media';
                preview.append(frame, crearEtiqueta());
                target.append(preview);
                card.classList.add('is-previewing');
            }, DELAY_MS);
        });
        card.addEventListener('mouseleave', retirar);
        card.addEventListener('focusout', event => { if (!card.contains(event.relatedTarget)) retirar(); });
    }

    document.addEventListener('DOMContentLoaded', () => document.querySelectorAll('.video-card').forEach(activarPreview), { once: true });
})();
