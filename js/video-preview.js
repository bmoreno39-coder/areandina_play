/* Vista previa silenciosa: usa data-preview-url de cada tarjeta de video. */
(() => {
    const DELAY_MS = 350;
    let activo = null;

    function detenerActivo(exceptoCard) {
        if (activo && activo.card !== exceptoCard) {
            activo.retirar();
            activo = null;
        }
    }

    function crearEtiqueta() {
        const label = document.createElement('span');
        label.textContent = 'Vista previa';
        return label;
    }

    function construirEmbed(id) {
        return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&controls=0&playsinline=1&rel=0`;
    }

    function obtenerVideoIdDesdeUrl(url) {
        try {
            const u = new URL(url);
            return u.searchParams.get('v') || u.pathname.split('/').filter(Boolean).pop() || '';
        } catch { return ''; }
    }

    function obtenerUrlPreview(card) {
        if (card.dataset.previewUrl) return card.dataset.previewUrl;
        if (card.dataset.videoId) return construirEmbed(card.dataset.videoId);
        const match = (card.getAttribute('onclick') || '').match(/reproducirVideo\('([^']+)'/);
        if (match && /youtu\.be|youtube\.com/.test(match[1])) {
            const id = obtenerVideoIdDesdeUrl(match[1]);
            if (id) return construirEmbed(id);
        }
        const thumbSrc = card.querySelector('.video-thumb')?.src || '';
        const thumbMatch = thumbSrc.match(/img\.youtube\.com\/vi\/([^/]+)/);
        if (thumbMatch) return construirEmbed(thumbMatch[1]);
        return '';
    }

    function activarPreview(card) {
        if (card.dataset.previewReady) return;
        card.dataset.previewReady = 'true';
        const previewUrl = obtenerUrlPreview(card);
        if (!previewUrl) return;
        let target = card.querySelector('.video-thumb-container');
        if (!target) {
            const thumb = card.querySelector('.video-thumb');
            if (!thumb) return;
            target = document.createElement('div');
            target.className = 'video-thumb-container';
            thumb.parentNode.insertBefore(target, thumb);
            target.append(thumb);
        }
        let timer;
        let preview = null;
        const retirar = () => {
            window.clearTimeout(timer);
            card.classList.remove('is-previewing');
            if (preview) {
                const frame = preview.querySelector('iframe');
                if (frame) frame.src = 'about:blank';
                preview.remove();
                preview = null;
            }
            if (activo && activo.card === card) activo = null;
        };
        activo = { card, retirar };
        const mostrar = () => {
            window.clearTimeout(timer);
            timer = window.setTimeout(() => {
                if (!card.matches(':hover')) return;
                detenerActivo(card);
                preview = document.createElement('div');
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
        };
        card.addEventListener('mouseenter', mostrar);
        card.addEventListener('mouseleave', retirar);
        card.addEventListener('focusout', event => { if (!card.contains(event.relatedTarget)) retirar(); });
        if (card.matches(':hover')) mostrar();
    }

    document.addEventListener('mouseover', event => {
        const card = event.target.closest && event.target.closest('.video-card');
        detenerActivo(card);
        if (card) activarPreview(card);
    });
    document.addEventListener('mouseout', event => {
        if (!event.relatedTarget) detenerActivo();
    });
})();