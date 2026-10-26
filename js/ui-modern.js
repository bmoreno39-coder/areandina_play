/*
 * COLOSO PLAY · INTERACCIONES DE INTERFAZ
 * ---------------------------------------------------------------------------
 * Capa de mejoras visuales que no depende del contenido:
 *   · barra de progreso de lectura
 *   · header compacto al hacer scroll
 *   · animaciones de entrada con IntersectionObserver
 *   · flechas y gestos para el hero
 *   · botón "volver arriba"
 *   · cierre del reproductor con Escape / clic en el fondo
 *
 * Respeta "Reducir movimiento" del panel de accesibilidad y la preferencia
 * del sistema operativo. Si algo falla, la página sigue funcionando igual.
 */
(function () {
    'use strict';

    const reduceMotion = () =>
        document.body.classList.contains('a11y-reduce-motion') ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------------------------------------------------------------------
       Barra de progreso de lectura
       --------------------------------------------------------------------- */
    function iniciarProgreso() {
        const barra = document.createElement('div');
        barra.className = 'cp-scroll-progress';
        barra.setAttribute('aria-hidden', 'true');
        document.body.append(barra);

        const actualizar = () => {
            const recorrido = document.documentElement.scrollHeight - window.innerHeight;
            const progreso = recorrido > 0 ? Math.min(window.scrollY / recorrido, 1) : 0;
            barra.style.transform = `scaleX(${progreso})`;
        };

        actualizar();
        window.addEventListener('scroll', actualizar, { passive: true });
        window.addEventListener('resize', actualizar);
    }

    /* ---------------------------------------------------------------------
       Header compacto
       --------------------------------------------------------------------- */
    function iniciarHeader() {
        const header = document.querySelector('.header');
        if (!header) return;

        const actualizar = () => header.classList.toggle('is-scrolled', window.scrollY > 10);
        actualizar();
        window.addEventListener('scroll', actualizar, { passive: true });
    }

    /* ---------------------------------------------------------------------
       Botón volver arriba
       --------------------------------------------------------------------- */
    function iniciarVolverArriba() {
        const boton = document.createElement('button');
        boton.type = 'button';
        boton.className = 'cp-to-top';
        boton.setAttribute('aria-label', 'Volver arriba');
        boton.innerHTML = '<span aria-hidden="true">↑</span>';
        document.body.append(boton);

        const actualizar = () => boton.classList.toggle('is-visible', window.scrollY > 620);
        actualizar();
        window.addEventListener('scroll', actualizar, { passive: true });

        boton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: reduceMotion() ? 'auto' : 'smooth' });
        });
    }

    /* ---------------------------------------------------------------------
       Animación de entrada por bloques
       --------------------------------------------------------------------- */
    function iniciarRevelado() {
        if (reduceMotion() || !('IntersectionObserver' in window)) return;

        const selector = [
            '.filters-section',
            '.section-header',
            '.subsection-title',
            '.video-card',
            '.facultad-card',
            '.presentacion-card',
            '.info-card',
            '.banner-3d',
            '.footer-column',
            '.page-header',
            '.canal-header',
            '.canal-info',
            '.top-bar'
        ].join(',');

        const elementos = [...document.querySelectorAll(selector)];
        if (!elementos.length) return;

        const indicePorPadre = new Map();
        elementos.forEach((elemento) => {
            const padre = elemento.parentElement || document.body;
            const indice = indicePorPadre.get(padre) || 0;
            indicePorPadre.set(padre, indice + 1);
            elemento.classList.add('reveal');
            elemento.style.setProperty('--reveal-delay', `${Math.min(indice, 6) * 55}ms`);
        });

        const observador = new IntersectionObserver((entradas) => {
            entradas.forEach((entrada) => {
                if (!entrada.isIntersecting) return;
                entrada.target.classList.add('is-visible');
                observador.unobserve(entrada.target);
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 140px -40px 140px'
        });

        elementos.forEach((elemento) => observador.observe(elemento));

        // Red de seguridad: si algo impide observar, mostrar todo.
        window.setTimeout(() => {
            elementos.forEach((elemento) => {
                if (elemento.classList.contains('is-visible')) return;
                const rect = elemento.getBoundingClientRect();
                if (rect.top < window.innerHeight) elemento.classList.add('is-visible');
            });
        }, 2200);
    }

    /* ---------------------------------------------------------------------
       Hero: flechas, teclado y gestos táctiles
       --------------------------------------------------------------------- */
    function iniciarHero() {
        const hero = document.getElementById('heroCarousel');
        const dots = document.getElementById('heroDots');
        if (!hero || !dots) return;

        const obtenerDots = () => [...dots.querySelectorAll('.dot')];
        const ir = (direccion) => {
            const lista = obtenerDots();
            if (!lista.length) return;
            const actual = lista.findIndex((dot) => dot.classList.contains('active'));
            const siguiente = (actual + direccion + lista.length) % lista.length;
            lista[siguiente].click();
        };

        if (!hero.querySelector('.hero-arrow')) {
            [['prev', '❮', 'Anuncio anterior'], ['next', '❯', 'Anuncio siguiente']]
                .forEach(([clase, icono, etiqueta]) => {
                    const boton = document.createElement('button');
                    boton.type = 'button';
                    boton.className = `hero-arrow ${clase}`;
                    boton.textContent = icono;
                    boton.setAttribute('aria-label', etiqueta);
                    boton.addEventListener('click', () => ir(clase === 'next' ? 1 : -1));
                    hero.append(boton);
                });
        }

        let inicioX = null;
        hero.addEventListener('touchstart', (evento) => {
            inicioX = evento.touches[0]?.clientX ?? null;
        }, { passive: true });

        hero.addEventListener('touchend', (evento) => {
            if (inicioX === null) return;
            const finX = evento.changedTouches[0]?.clientX ?? inicioX;
            const delta = finX - inicioX;
            if (Math.abs(delta) > 48) ir(delta < 0 ? 1 : -1);
            inicioX = null;
        }, { passive: true });
    }

    /* ---------------------------------------------------------------------
       Reproductor: clase de apertura, Escape y clic en el fondo
       --------------------------------------------------------------------- */
    function iniciarReproductor() {
        const modal = document.getElementById('videoModal');
        if (!modal) return;

        // Cualquier apertura (app.js / seccion.js / canal.js) pasa por aquí.
        const observador = new MutationObserver(() => {
            const abierto = modal.style.display === 'flex';
            if (modal.classList.contains('is-open') !== abierto) {
                modal.classList.toggle('is-open', abierto);
            }
        });
        observador.observe(modal, { attributes: true, attributeFilter: ['style', 'class'] });

        modal.addEventListener('click', (evento) => {
            if (evento.target === modal) document.getElementById('closeModal')?.click();
        });

        document.addEventListener('keydown', (evento) => {
            if (evento.key !== 'Escape') return;
            if (modal.style.display === 'flex') document.getElementById('closeModal')?.click();
        });
    }

    /* ---------------------------------------------------------------------
       Arranque: después de que app.js / seccion.js / canal.js pinten contenido
       --------------------------------------------------------------------- */
    function iniciar() {
        iniciarProgreso();
        iniciarHeader();
        iniciarVolverArriba();
        iniciarRevelado();
        iniciarHero();
        iniciarReproductor();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciar, { once: true });
    } else {
        iniciar();
    }
})();
