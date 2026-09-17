/*
 * PÁGINA DE SECCIÓN
 * Orden del archivo: reproductor y métricas, catálogo de videos, filtros,
 * buscador, navegación y preferencias visuales.
 * Para agregar contenido, busca el bloque "CATÁLOGO DE VIDEOS".
 */

        // ===== REPRODUCTOR Y MÉTRICAS =====
        function reproducirVideo(url, titulo) {
            registrarVisita(titulo);
            const modal = document.getElementById('videoModal');
            const iframe = document.getElementById('videoIframe');
            const title = document.getElementById('videoTitle');
            iframe.src = url;
            title.innerText = titulo;
            modal.style.display = 'flex';
        }

        document.getElementById('closeModal').onclick = () => {
            document.getElementById('videoModal').style.display = 'none';
            document.getElementById('videoIframe').src = '';
        };
        document.getElementById('fullscreenBtn').onclick = () => {
            const iframe = document.getElementById('videoIframe');
            if (iframe.requestFullscreen) iframe.requestFullscreen();
        };

        // Categoria de vistas
        function registrarVisita(tituloVideo) {
            window.ColosoAnalytics?.registrarVideo(tituloVideo);
            let visitasGuardadas = localStorage.getItem('visitasVideo');
            let visitasMap = {};
            if (visitasGuardadas) {
                try { visitasMap = JSON.parse(visitasGuardadas); } catch(e) {}
            }
            const nuevaCantidad = (visitasMap[tituloVideo] || 0) + 1;
            visitasMap[tituloVideo] = nuevaCantidad;
            localStorage.setItem('visitasVideo', JSON.stringify(visitasMap));
            
            const visitasTexto = nuevaCantidad >= 1000 ? (nuevaCantidad/1000).toFixed(1) + 'k' : nuevaCantidad;
            document.querySelectorAll('.video-card').forEach(tarjeta => {
                const tituloElem = tarjeta.querySelector('.video-title');
                if (tituloElem && tituloElem.innerText === tituloVideo) {
                    const metaElem = tarjeta.querySelector('.video-meta');
                    if (metaElem) metaElem.innerHTML = `📺 ${visitasTexto} vistas`;
                }
            });
        }

        function obtenerVistas(tituloVideo) {
            const visitas = JSON.parse(localStorage.getItem('visitasVideo') || '{}');
            return visitas[tituloVideo] || 0;
        }

        function actualizarTodasLasVistas() {
            const visitasGuardadas = localStorage.getItem('visitasVideo');
            if (!visitasGuardadas) return;
            try {
                const visitasMap = JSON.parse(visitasGuardadas);
                document.querySelectorAll('.video-card').forEach(tarjeta => {
                    const tituloElem = tarjeta.querySelector('.video-title');
                    if (tituloElem) {
                        const titulo = tituloElem.innerText;
                        const visitas = visitasMap[titulo] || 0;
                        const visitasTexto = visitas >= 1000 ? (visitas/1000).toFixed(1) + 'k' : visitas;
                        const metaElem = tarjeta.querySelector('.video-meta');
                        if (metaElem) metaElem.innerHTML = `📺 ${visitasTexto} vistas`;
                    }
                });
            } catch(e) {}
        }

        // Categorias disponibles
        const CATEGORIAS = [
            { id: 'todos', nombre: 'Todas las categorías', icono: '🎬' },
            { id: 'ceremonia', nombre: 'Ceremonias', icono: '🎓' },
            { id: 'podcast', nombre: 'Podcasts', icono: '🎙️' },
            { id: 'webinar', nombre: 'Webinars', icono: '💻' },
            { id: 'charla', nombre: 'Charlas', icono: '🎤' },
        ];

        // Datos en secciones
        const urlParams = new URLSearchParams(window.location.search);
        const seccion = urlParams.get('seccion') || 'COMUNICACIONES';

        const datosSecciones = {
            COMUNICACIONES: {
                titulo: "🎓 CEREMONIAS DE GRADUACIÓN",
                descripcion: "Todas las ceremonias organizadas por sede",
                subs: [
                    { nombre: "📍 Bogotá", videos: [
                        { titulo: "GRADOS BOGOTÁ 16/04/2024 12:30 PM", thumb: "https://img.youtube.com/vi/VymY43F976U/maxresdefault.jpg", url: "https://www.youtube.com/embed/VymY43F976U", categoria: "ceremonia", vistas: 0 },
                        { titulo: "GRADOS BOGOTÁ 16/04/2026 3:00 PM", thumb: "https://img.youtube.com/vi/osbYgBynCs4/maxresdefault.jpg", url: "https://www.youtube.com/embed/osbYgBynCs4", categoria: "ceremonia", vistas: 0 },
                        { titulo: "GRADOS BOGOTÁ 17/04/2026 7:00 AM", thumb: "https://img.youtube.com/vi/jWGY9lGQ4Uc/maxresdefault.jpg", url: "https://www.youtube.com/embed/jWGY9lGQ4Uc", categoria: "ceremonia", vistas: 0 },
                        { titulo: "GRADOS BOGOTÁ 17/04/2026 12:30 PM", thumb: "https://img.youtube.com/vi/6AOBsPOuovQ/maxresdefault.jpg", url: "https://www.youtube.com/embed/6AOBsPOuovQ", categoria: "ceremonia", vistas: 0 },
                        { titulo: "GRADOS BOGOTÁ 04/03/2024 7:00 AM", thumb: "https://img.youtube.com/vi/12SlFTXScQc/maxresdefault.jpg", url: "https://www.youtube.com/embed/12SlFTXScQc", categoria: "ceremonia", vistas: 0 },
                        { titulo: "GRADOS BOGOTÁ 04/03/2024 1:00 PM", thumb: "https://img.youtube.com/vi/pJq692mc8hw/maxresdefault.jpg", url: "https://www.youtube.com/embed/pJq692mc8hw", categoria: "ceremonia", vistas: 0 },
                        { titulo: "GRADOS BOGOTÁ 04/03/2024 5:00 PM", thumb: "https://img.youtube.com/vi/nHHNqEjMzSU/maxresdefault.jpg", url: "https://www.youtube.com/embed/nHHNqEjMzSU", categoria: "ceremonia", vistas: 0 },
                        { titulo: "GRADOS BOGOTÁ 05/03/2024 8:00 AM", thumb: "https://img.youtube.com/vi/43C_jSIS4RU/maxresdefault.jpg", url: "https://www.youtube.com/embed/43C_jSIS4RU", categoria: "ceremonia", vistas: 0 },
                        { titulo: "GRADOS BOGOTÁ 05/03/2024 11:00 AM", thumb: "https://img.youtube.com/vi/jl0WNQ3q18E/maxresdefault.jpg", url: "https://www.youtube.com/embed/jl0WNQ3q18E", categoria: "ceremonia", vistas: 0 },
                        { titulo: "GRADOS BOGOTÁ 05/03/2024 4:00 PM", thumb: "https://img.youtube.com/vi/mJPqwXy8Euk/maxresdefault.jpg", url: "https://www.youtube.com/embed/mJPqwXy8Euk", categoria: "ceremonia", vistas: 0 }
                        
                    ]},
                    { nombre: "📍 Pereira", videos: [
                        { titulo: "CEREMONIA DE GRADOS PEREIRA 13/04/2026 08:30 AM", thumb: "https://img.youtube.com/vi/Hz_P_LQ2h2o/maxresdefault.jpg", url: "https://www.youtube.com/embed/Hz_P_LQ2h2o", categoria: "ceremonia", vistas: 0 },
                        { titulo: "CEREMONIA DE GRADOS PEREIRA 13/04/2026 10:00 AM", thumb: "https://img.youtube.com/vi/_q7yevYTxbE/maxresdefault.jpg", url: "https://www.youtube.com/embed/_q7yevYTxbE", categoria: "ceremonia", vistas: 0 },
                        { titulo: "CEREMONIA DE GRADOS PEREIRA 13/04/2026 04:30 PM", thumb: "https://img.youtube.com/vi/GcSa2lpyIrc/maxresdefault.jpg", url: "https://www.youtube.com/embed/GcSa2lpyIrc", categoria: "ceremonia", vistas: 0 }
                    ]},
                    { nombre: "📍 Valledupar", videos: [
                        { titulo: "CEREMONIA DE GRADOS VALLEDUPAR 23/04/2026 9:00 AM", thumb: "https://img.youtube.com/vi/nuIIACAviZI/mqdefault.jpg", url: "https://www.youtube.com/embed/nuIIACAviZI", categoria: "ceremonia", vistas: 0 },
                        { titulo: "CEREMONIA DE GRADOS VALLEDUPAR 23/04/2026 2:00 PM", thumb: "https://img.youtube.com/vi/n8u62NhUOKA/mqdefault.jpg", url: "https://www.youtube.com/embed/n8u62NhUOKA", categoria: "ceremonia", vistas: 0 }
                    ]},
                    { nombre: "💻 Virtuales", videos: [
                        { titulo: "Graduación Virtual", thumb: "https://img.youtube.com/vi/12SlFTXScQc/maxresdefault.jpg", url: "https://www.youtube.com/embed/12SlFTXScQc", categoria: "ceremonia", vistas: 0 },
                        { titulo: "Graduación Virtual 2", thumb: "https://img.youtube.com/vi/pJq692mc8hw/maxresdefault.jpg", url: "https://www.youtube.com/embed/pJq692mc8hw", categoria: "ceremonia", vistas: 0 },
                        { titulo: "Graduación Virtual 3", thumb: "https://img.youtube.com/vi/nHHNqEjMzSU/maxresdefault.jpg", url: "https://www.youtube.com/embed/nHHNqEjMzSU", categoria: "ceremonia", vistas: 0 }
                    ]}
                ]
            },
            innovacion: {
                titulo: "💡 CENTRO DE INNOVACIÓN TECNOLÓGICA",
                descripcion: "Capacitaciones y programas de innovación",
                subs: [
                    { nombre: "🔧 Capacitaciones Ceita", videos: [
                        { titulo: "Capacitación Ceita 1", thumb: "https://img.youtube.com/vi/Ar42N3JKTpU/maxresdefault.jpg", url: "https://www.youtube.com/embed/Ar42N3JKTpU", categoria: "webinar", vistas: 0 },
                        { titulo: "Capacitación Ceita 2", thumb: "https://img.youtube.com/vi/JRv_2TJKWNo/maxresdefault.jpg", url: "https://www.youtube.com/embed/JRv_2TJKWNo", categoria: "webinar", vistas: 0 },
                        { titulo: "Capacitación Ceita 3", thumb: "https://img.youtube.com/vi/Jp4PXRk76i8/maxresdefault.jpg", url: "https://www.youtube.com/embed/Jp4PXRk76i8", categoria: "webinar", vistas: 0 }
                    ]},
                    { nombre: "⚡ Parrilla 4.0", videos: [
                        { titulo: "Parrilla 4.0 - Capacitación 1", thumb: "https://img.youtube.com/vi/Ar42N3JKTpU/maxresdefault.jpg", url: "https://www.youtube.com/embed/Ar42N3JKTpU", categoria: "tutorial", vistas: 0 },
                        { titulo: "Parrilla 4.0 - Capacitación 2", thumb: "https://img.youtube.com/vi/JRv_2TJKWNo/maxresdefault.jpg", url: "https://www.youtube.com/embed/JRv_2TJKWNo", categoria: "tutorial", vistas: 0 }
                    ]}
                ]
            },
            realidades: {
                titulo: "🧑🏫 DOCENTES",
                descripcion: "Espacios virtuales y contenidos educativos",
                subs: [
                    { nombre: "🕶️ Espacios Virtuales", videos: [
                        { titulo: "Realidad Virtual - Introducción", thumb: "https://img.youtube.com/vi/DkiDGwy8vGM/maxresdefault.jpg", url: "https://www.youtube.com/embed/DkiDGwy8vGM", categoria: "documental", vistas: 0 },
                        { titulo: "Recorrido VR - Experiencia Educativa", thumb: "https://img.youtube.com/vi/DkiDGwy8vGM/maxresdefault.jpg", url: "https://www.youtube.com/embed/DkiDGwy8vGM", categoria: "documental", vistas: 0 }
                    ]},
                    { nombre: "💭 Viernes de humanismo digital", videos: [
                        { titulo: "Humanismo Digital - Conversatorio", thumb: "https://img.youtube.com/vi/DkiDGwy8vGM/maxresdefault.jpg", url: "https://www.youtube.com/embed/DkiDGwy8vGM", categoria: "documental", vistas: 0 }
                    ]},
                    { nombre: "🧠 Catedra de pensamiento", videos: [
                        { titulo: "Cátedra de Pensamiento - Charla", thumb: "https://img.youtube.com/vi/DkiDGwy8vGM/maxresdefault.jpg", url: "https://www.youtube.com/embed/DkiDGwy8vGM", categoria: "documental", vistas: 0 }
                    ]},
                    { nombre: "📚 Contenidos Educativos", videos: [
                        { titulo: "Contenido 360 - Clase 1", thumb: "https://img.youtube.com/vi/DkiDGwy8vGM/maxresdefault.jpg", url: "https://www.youtube.com/embed/DkiDGwy8vGM", categoria: "tutorial", vistas: 0 }
                    ]}
                ]
            },
            bienestar: {
                titulo: "❤️ BIENESTAR UNIVERSITARIO",
                descripcion: "Programas de bienestar y permanencia",
                subs: [
                    { nombre: "❤️ Bienestar", videos: [
                        { titulo: "Bienestar Universitario", thumb: "https://img.youtube.com/vi/nOJ8n0_IXus/maxresdefault.jpg", url: "https://www.youtube.com/embed/nOJ8n0_IXus", categoria: "charla", vistas: 0 },
                        { titulo: "Salud Mental - Taller", thumb: "https://img.youtube.com/vi/nOJ8n0_IXus/maxresdefault.jpg", url: "https://www.youtube.com/embed/nOJ8n0_IXus", categoria: "charla", vistas: 0 }
                    ]},
                    { nombre: "📖 Inducciones", videos: [
                        { titulo: "Inducción Estudiantil", thumb: "https://img.youtube.com/vi/nOJ8n0_IXus/maxresdefault.jpg", url: "https://www.youtube.com/embed/nOJ8n0_IXus", categoria: "charla", vistas: 0 }
                    ]}
                ]
            }
        };

        const data = datosSecciones[seccion] || datosSecciones.COMUNICACIONES;
        document.getElementById('seccionTitulo').innerText = data.titulo;
        document.getElementById('seccionDescripcion').innerText = data.descripcion;

        function obtenerVideoId(url) {
            try {
                const u = new URL(url);
                return u.searchParams.get('v') || u.pathname.split('/').filter(Boolean).pop() || '';
            } catch { return ''; }
        }

        function crearTarjetaVideo(video) {
            const visitas = obtenerVistas(video.titulo);
            const visitasTexto = visitas >= 1000 ? (visitas/1000).toFixed(1) + 'k' : visitas;
            const videoId = obtenerVideoId(video.url);
            const previewUrl = videoId ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&playsinline=1&rel=0` : '';
            return `
                <div class="video-card" onclick="reproducirVideo('${video.url}', '${video.titulo}')"${previewUrl ? ` data-preview-url="${previewUrl}"` : ''}>
                    <div class="video-thumb-container">
                        <img src="${video.thumb}" class="video-thumb" alt="Miniatura: ${video.titulo}">
                    </div>
                    <div class="video-info">
                        <div class="video-title">${video.titulo}</div>
                        <div class="video-meta">📺 ${visitasTexto} vistas</div>
                    </div>
                </div>
            `;
        }

        // Filtro por categorias
        let filtroActivo = 'todos';

        function actualizarOpcionesFiltro() {
            const container = document.getElementById('dropdownFiltroContent');
            if (!container) return;
            
            container.innerHTML = CATEGORIAS.map(cat => `
                <button class="filtro-option ${filtroActivo === cat.id ? 'active' : ''}" data-filtro="${cat.id}">
                    ${cat.icono} ${cat.nombre}
                </button>
            `).join('');
            
            // Actualizar texto del botón
            const btnTexto = document.getElementById('dropdownFiltroBtn');
            const categoriaSeleccionada = CATEGORIAS.find(cat => cat.id === filtroActivo);
            if (btnTexto && categoriaSeleccionada) {
                btnTexto.innerHTML = `${categoriaSeleccionada.icono} ${categoriaSeleccionada.nombre} <span class="dropdown-arrow">▼</span>`;
            }
            
            document.querySelectorAll('.filtro-option').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    filtroActivo = btn.getAttribute('data-filtro');
                    actualizarOpcionesFiltro();
                    renderizarPorCategoria();
                    document.getElementById('dropdownFiltroContent').classList.remove('show');
                });
            });
        }

        function renderizarPorCategoria() {
            const container = document.getElementById('subseccionesContainer');
            
            let todosLosVideos = [];
            data.subs.forEach(sub => {
                sub.videos.forEach(video => {
                    todosLosVideos.push({
                        ...video,
                        subseccion: sub.nombre
                    });
                });
            });
            
            // Filtrar por categoría
            if (filtroActivo !== 'todos') {
                todosLosVideos = todosLosVideos.filter(video => video.categoria === filtroActivo);
            }
            
            const videosPorSubseccion = {};
            todosLosVideos.forEach(video => {
                if (!videosPorSubseccion[video.subseccion]) {
                    videosPorSubseccion[video.subseccion] = [];
                }
                videosPorSubseccion[video.subseccion].push(video);
            });
            
            // Mostrar resultados o mensaje vacío
            if (Object.keys(videosPorSubseccion).length === 0) {
                container.innerHTML = `<div class="sin-resultados">
                    <h3>🎬 No hay videos en esta categoría</h3>
                    <p>Próximamente agregaremos más contenido.</p>
                </div>`;
                return;
            }
            
            // Renderizar
            container.innerHTML = Object.keys(videosPorSubseccion).map(subNombre => `
                <div class="subsection">
                    <h3 class="subsection-title">${subNombre}</h3>
                    <div class="carousel-container">
                        <div class="carousel-track">
                            ${videosPorSubseccion[subNombre].map(v => crearTarjetaVideo(v)).join('')}
                        </div>
                        <button class="carousel-btn left">❮</button>
                        <button class="carousel-btn right">❯</button>
                    </div>
                </div>
            `).join('');
            
            inicializarCarruseles();
            setTimeout(actualizarTodasLasVistas, 100);
        }

        // Toggle del dropdown
        document.getElementById('dropdownFiltroBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('dropdownFiltroContent').classList.toggle('show');
        });

        document.addEventListener('click', () => {
            document.getElementById('dropdownFiltroContent').classList.remove('show');
        });

        function inicializarCarruseles() {
            document.querySelectorAll('.carousel-container').forEach(container => {
                const leftBtn = container.querySelector('.carousel-btn.left');
                const rightBtn = container.querySelector('.carousel-btn.right');
                const track = container.querySelector('.carousel-track');
                if (leftBtn && rightBtn && track) {
                    const newLeft = leftBtn.cloneNode(true);
                    const newRight = rightBtn.cloneNode(true);
                    leftBtn.parentNode.replaceChild(newLeft, leftBtn);
                    rightBtn.parentNode.replaceChild(newRight, rightBtn);
                    newLeft.onclick = () => track.scrollBy({ left: -300, behavior: 'smooth' });
                    newRight.onclick = () => track.scrollBy({ left: 300, behavior: 'smooth' });
                }
            });
        }

        // Inicializar todo
        actualizarOpcionesFiltro();
        renderizarPorCategoria();

        document.getElementById('navInicio').onclick = () => window.ColoNavegar?.('index.html');
        document.getElementById('navCOMUNICACIONES').onclick = () => window.ColoNavegar?.('seccion.html?seccion=COMUNICACIONES');
        document.getElementById('navInnovacion').onclick = () => window.ColoNavegar?.('seccion.html?seccion=innovacion');
        document.getElementById('navBienestar').onclick = () => window.ColoNavegar?.('seccion.html?seccion=bienestar');
        document.getElementById('navRealidades').onclick = () => window.ColoNavegar?.('seccion.html?seccion=realidades');
        
        const facultadesLinks = document.querySelectorAll('#dropdownFacultades a');
        for (let i = 0; i < facultadesLinks.length; i++) {
            facultadesLinks[i].onclick = (e) => {
                e.preventDefault();
                const id = e.target.getAttribute('data-id');
                window.ColoNavegar?.('canal.html?tipo=facultad&id=' + id);
            };
        }

        // Buscador
        const searchInput = document.getElementById('searchInput');
        const searchDropdown = document.getElementById('searchDropdown');
        if (searchInput) {
            const videos = [];
            document.querySelectorAll('.video-card').forEach(card => {
                const tituloElem = card.querySelector('.video-title');
                const titulo = tituloElem ? tituloElem.innerText : '';
                const onclickAttr = card.getAttribute('onclick');
                let url = '';
                if (onclickAttr) {
                    const match = onclickAttr.match(/reproducirVideo\('([^']+)'/);
                    if (match) url = match[1];
                }
                if (titulo) videos.push({ titulo, url });
            });
            
            searchInput.addEventListener('input', (e) => {
                const termino = e.target.value.toLowerCase().trim();
                if (termino.length < 2) { searchDropdown.style.display = 'none'; return; }
                const resultados = videos.filter(v => v.titulo.toLowerCase().includes(termino));
                if (resultados.length > 0) {
                    searchDropdown.innerHTML = resultados.map(v => `
                        <div class="search-dropdown-item" onclick="reproducirVideo('${v.url}', '${v.titulo}')">
                            <div style="padding: 10px;"><div style="font-weight:500;">${v.titulo}</div></div>
                        </div>
                    `).join('');
                    searchDropdown.style.display = 'block';
                } else {
                    searchDropdown.innerHTML = '<div class="search-dropdown-item">🔍 No se encontraron resultados</div>';
                    searchDropdown.style.display = 'block';
                }
            });
            
            document.addEventListener('click', (e) => {
                if (!searchInput.contains(e.target)) searchDropdown.style.display = 'none';
            });
        }

        const themeToggle = document.getElementById('themeToggle');
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
            themeToggle.innerHTML = '☀️';
        }
        if (themeToggle) {
            themeToggle.onclick = () => {
                document.body.classList.toggle('dark-mode');
                const isDark = document.body.classList.contains('dark-mode');
                themeToggle.innerHTML = isDark ? '☀️' : '🌙';
                localStorage.setItem('darkMode', isDark);
            };
        }

        document.getElementById('logoLink').onclick = () => window.ColoNavegar?.('index.html');
