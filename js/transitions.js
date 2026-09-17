/* COLOSO TRANSICIONES — fundido suave entre páginas de Coloso Play.
 * Expone window.ColoNavegar(url) para navegaciones controladas desde JS
 * y se encarga de los enlaces <a> hacia otras páginas locales (.html).
 * El overlay #pageTransition se define con estilos en css/style.css.
 */
(function () {
    'use strict';

    const reducirMovimiento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.body.classList.contains('a11y-reduce-motion');
    const DELAY_MS = 220;
    let navegando = false;

    function navegarConTransicion(url) {
        if (navegando) return;
        const overlay = document.getElementById('pageTransition');
        if (!overlay || reducirMovimiento()) {
            window.location.href = url;
            return;
        }
        navegando = true;
        overlay.classList.add('is-active');
        window.setTimeout(() => { window.location.href = url; }, DELAY_MS);
    }

    window.ColoNavegar = navegarConTransicion;

    document.addEventListener('click', (evento) => {
        if (evento.defaultPrevented || evento.button !== 0) return;
        if (evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return;
        const enlace = evento.target.closest('a');
        if (!enlace) return;
        if (enlace.target === '_blank') return;
        const href = (enlace.getAttribute('href') || '').trim();
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http')) return;
        if (!href.includes('.html')) return;
        evento.preventDefault();
        navegarConTransicion(enlace.href);
    });
})();