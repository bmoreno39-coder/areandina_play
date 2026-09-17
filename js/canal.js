/*
 * PÁGINA DE CANAL
 * Orden del archivo: reproductor y métricas, información del canal,
 * catálogo, filtros, buscador y preferencias visuales.
 * Para editar un canal o sus videos, busca el bloque "DATOS DEL CANAL".
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

        // Contador de vistas
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
            actualizarTotalVideos();
            actualizarVistasTotalesCanal();
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

        function actualizarTotalVideos() {
            const totalVideos = document.querySelectorAll('.video-card').length;
            const totalVideosSpan = document.getElementById('totalVideos');
            if (totalVideosSpan) totalVideosSpan.innerText = totalVideos;
        }

        function actualizarVistasTotalesCanal() {
            const visitas = JSON.parse(localStorage.getItem('visitasVideo') || '{}');
            let total = 0;
            if (canalData && canalData.carreras) {
                canalData.carreras.forEach(carrera => {
                    carrera.videos.forEach(video => {
                        total += visitas[video.titulo] || 0;
                    });
                });
            }
            const totalVistasSpan = document.getElementById('totalVistasCanal');
            if (totalVistasSpan) totalVistasSpan.innerText = total;
        }

        // Categorias para el filtro
        const CATEGORIAS = [
            { id: 'todos', nombre: 'Todos', icono: '🎬' },
            { id: 'ceremonia', nombre: 'Ceremonias', icono: '🎓' },
            { id: 'podcast', nombre: 'Podcasts', icono: '🎙️' },
            { id: 'webinar', nombre: 'Webinars', icono: '💻' },
            { id: 'charla', nombre: 'Charlas', icono: '🎤' },
        ];

        let filtroActivo = 'todos';

        // Datos de facultades con carreras
        const urlParams = new URLSearchParams(window.location.search);
        const tipo = urlParams.get('tipo') || 'facultad';
        const id = urlParams.get('id') || 'ingenieria';

        const canalesData = {
            institucion: {
                nombre: "NUESTRA INSTITUCIÓN",
                descripcion: "Conoce la historia, himno, infraestructura y más",
                logo: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=200&h=200&fit=crop",
                suscriptores: "15.2K",
                carreras: [
                    { nombre: "Historia", videos: [
                        { titulo: "Historia de Areandina", thumb: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 },
                        { titulo: "Fundación de la Universidad", thumb: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]},
                    { nombre: "Himno", videos: [
                        { titulo: "Himno de Areandina", thumb: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]},
                    { nombre: "Infraestructura", videos: [
                        { titulo: "Sede Bogotá", thumb: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 },
                        { titulo: "Sede Pereira", thumb: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 },
                        { titulo: "Sede Valledupar", thumb: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]},
                    { nombre: "Acreditaciones", videos: [
                        { titulo: "Acreditación Institucional", thumb: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]}
                ]
            },
            administrativas: {
                nombre: "FACULTAD DE CIENCIAS ADMINISTRATIVAS, ECONÓMICAS Y FINANCIERAS",
                descripcion: "Formando líderes empresariales y financieros",
                logo: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&h=200&fit=crop",
                suscriptores: "4.8K",
                carreras: [
                    { nombre: "Administración de Empresas", videos: [
                        { titulo: "Introducción a la Administración", thumb: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 },
                        { titulo: "Gestión Empresarial", thumb: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]},
                    { nombre: "Negocios Internacionales", videos: [
                        { titulo: "Comercio Internacional", thumb: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 },
                        { titulo: "Logística Global", thumb: "https://images.unsplash.com/photo-1559027615-9e8bdb4c2d6f?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]},
                    { nombre: "Mercadeo y Publicidad", videos: [
                        { titulo: "Estrategias de Marketing", thumb: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 },
                        { titulo: "Publicidad Digital", thumb: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]},
                    { nombre: "Contaduría Pública", videos: [
                        { titulo: "Principios de Contabilidad", thumb: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 },
                        { titulo: "Auditoría Financiera", thumb: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]},
                    { nombre: "Administración Pública", videos: [
                        { titulo: "Gestión Pública", thumb: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]},
                    { nombre: "Marketing de Negocios - Virtual", videos: [
                        { titulo: "Marketing Digital Avanzado", thumb: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]},
                    { nombre: "Finanzas y Negocios Internacionales", videos: [
                        { titulo: "Finanzas Corporativas", thumb: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]},
                    { nombre: "Economía - Virtual", videos: [
                        { titulo: "Microeconomía", thumb: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 },
                        { titulo: "Macroeconomía", thumb: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]},
                    { nombre: "Tec. Gestión del Talento Humano", videos: [
                        { titulo: "Gestión del Talento", thumb: "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]},
                    { nombre: "Tec. Gestión de Mercadeo y Publicidad", videos: [
                        { titulo: "Marketing Estratégico", thumb: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]}
                ]
            },
            salud: {
                nombre: "FACULTAD DE CIENCIAS DE LA SALUD Y DEL DEPORTE",
                descripcion: "Salud, bienestar y deporte para la comunidad",
                logo: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=200&h=200&fit=crop",
                suscriptores: "6.5K",
                carreras: [
                    { nombre: "Optometría", videos: [
                        { titulo: "Salud Visual", thumb: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]},
                    { nombre: "Enfermería", videos: [
                        { titulo: "Cuidados Básicos", thumb: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 },
                        { titulo: "Procedimientos Clínicos", thumb: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]},
                    { nombre: "Odontología", videos: [
                        { titulo: "Salud Oral", thumb: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]},
                    { nombre: "Terapia Respiratoria", videos: [
                        { titulo: "Fisioterapia Respiratoria", thumb: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]},
                    { nombre: "Medicina", videos: [
                        { titulo: "Anatomía Humana", thumb: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 },
                        { titulo: "Fisiología", thumb: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 },
                        { titulo: "Farmacología", thumb: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]},
                    { nombre: "Tec. Radiología e Imágenes Diagnósticas", videos: [
                        { titulo: "Radiología Básica", thumb: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]},
                    { nombre: "Instrumentación Quirúrgica", videos: [
                        { titulo: "Protocolos Quirúrgicos", thumb: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]},
                    { nombre: "Entrenamiento Deportivo", videos: [
                        { titulo: "Preparación Física", thumb: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 },
                        { titulo: "Nutrición Deportiva", thumb: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]},
                    { nombre: "Ingeniería Biomédica", videos: [
                        { titulo: "Equipos Médicos", thumb: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]},
                    { nombre: "Administración en Salud", videos: [
                        { titulo: "Gestión Hospitalaria", thumb: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]},
                    { nombre: "Fisioterapia", videos: [
                        { titulo: "Rehabilitación Física", thumb: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]}
                ]
            },
            diseno: {
                nombre: "FACULTAD DE DISEÑO, COMUNICACIÓN Y BELLAS ARTES",
                descripcion: "Creatividad, innovación y expresión artística",
                logo: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=200&h=200&fit=crop",
                suscriptores: "7.1K",
                carreras: [
                    { nombre: "Diseño de Modas", videos: [
                        { titulo: "Tendencias de Moda", thumb: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]},
                    { nombre: "Gastronomía y Culinaria", videos: [
                        { titulo: "Técnicas de Cocina", thumb: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 },
                        { titulo: "Repostería Creativa", thumb: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]},
                    { nombre: "Tec. Animación y Post-Producción Audiovisual", videos: [
                        { titulo: "Animación 2D", thumb: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]},
                    { nombre: "Diseño Gráfico", videos: [
                        { titulo: "Fundamentos del Diseño", thumb: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 },
                        { titulo: "Branding", thumb: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]},
                    { nombre: "Comunicación Social", videos: [
                        { titulo: "Teorías de la Comunicación", thumb: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]},
                    { nombre: "Comunicación Audiovisual Digital", videos: [
                        { titulo: "Producción Audiovisual", thumb: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 },
                        { titulo: "Edición de Video", thumb: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]},
                    { nombre: "Arquitectura", videos: [
                        { titulo: "Dibujo Arquitectónico", thumb: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 },
                        { titulo: "Diseño de Espacios", thumb: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]}
                ]
            },
            derecho: {
                nombre: "FACULTAD DE DERECHO",
                descripcion: "Excelencia y compromiso con la justicia",
                logo: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200&h=200&fit=crop",
                suscriptores: "6.2K",
                carreras: [
                    { nombre: "Derecho", videos: [
                        { titulo: "Introducción al Derecho", thumb: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 },
                        { titulo: "Derecho Penal", thumb: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 },
                        { titulo: "Derecho Civil", thumb: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 },
                        { titulo: "Derecho Constitucional", thumb: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]}
                ]
            },
            educacion: {
                nombre: "FACULTAD DE EDUCACIÓN",
                descripcion: "Formando los educadores del futuro",
                logo: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=200&h=200&fit=crop",
                suscriptores: "3.9K",
                carreras: [
                    { nombre: "Educación", videos: [
                        { titulo: "Pedagogía General", thumb: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]},
                    { nombre: "Licenciatura en Educación Infantil", videos: [
                        { titulo: "Desarrollo Infantil", thumb: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 },
                        { titulo: "Estrategias de Aprendizaje", thumb: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]},
                    { nombre: "Licenciatura en Ciencias Sociales", videos: [
                        { titulo: "Metodología de la Investigación", thumb: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]}
                ]
            },
            sociales: {
                nombre: "FACULTAD DE CIENCIAS SOCIALES Y HUMANAS",
                descripcion: "Entendiendo la sociedad y el comportamiento humano",
                logo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop",
                suscriptores: "5.3K",
                carreras: [
                    { nombre: "Psicología", videos: [
                        { titulo: "Psicología General", thumb: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 },
                        { titulo: "Psicología del Desarrollo", thumb: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 },
                        { titulo: "Psicología Social", thumb: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]},
                    { nombre: "Sociología", videos: [
                        { titulo: "Teorías Sociológicas", thumb: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 },
                        { titulo: "Estructura Social", thumb: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]}
                ]
            },
            ingenieria: {
                nombre: "FACULTAD DE INGENIERÍA Y CIENCIAS BÁSICAS",
                descripcion: "Innovación, tecnología y desarrollo para el futuro",
                logo: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=200&h=200&fit=crop",
                suscriptores: "8.5K",
                carreras: [
                    { nombre: "Ingeniería de Minas", videos: [
                        { titulo: "Introducción a la Minería", thumb: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 },
                        { titulo: "Geología Minera", thumb: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]},
                    { nombre: "Ingeniería Industrial", videos: [
                        { titulo: "Optimización de Procesos", thumb: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 },
                        { titulo: "Producción y Calidad", thumb: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 },
                        { titulo: "Logística Empresarial", thumb: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]},
                    { nombre: "Ingeniería de Sistemas", videos: [
                        { titulo: "Programación Básica", thumb: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 },
                        { titulo: "Bases de Datos", thumb: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 },
                        { titulo: "Ingeniería de Software", thumb: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]},
                    { nombre: "Ingeniería Geológica", videos: [
                        { titulo: "Geología Estructural", thumb: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]},
                    { nombre: "Tec. Ganadería Sostenible", videos: [
                        { titulo: "Manejo de Ganado", thumb: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]},
                    { nombre: "Ingeniería Biomédica", videos: [
                        { titulo: "Instrumentación Biomédica", thumb: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]},
                    { nombre: "Ingeniería Civil", videos: [
                        { titulo: "Mecánica de Materiales", thumb: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 },
                        { titulo: "Estructuras", thumb: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]},
                    { nombre: "Tec. Logística", videos: [
                        { titulo: "Cadena de Suministro", thumb: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]},
                    { nombre: "Ingeniería Ambiental", videos: [
                        { titulo: "Gestión Ambiental", thumb: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 },
                        { titulo: "Desarrollo Sostenible", thumb: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400&h=200&fit=crop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", vistas: 0 }
                    ]}
                ]
            }
        };

        let canalData = canalesData[id] || canalesData.ingenieria;
        document.getElementById('canalNombre').innerText = canalData.nombre;
        document.getElementById('canalDescripcion').innerText = canalData.descripcion;

        function obtenerVistasTotalesCanal() {
            const visitas = JSON.parse(localStorage.getItem('visitasVideo') || '{}');
            let total = 0;
            canalData.carreras.forEach(carrera => {
                carrera.videos.forEach(video => {
                    total += visitas[video.titulo] || 0;
                });
            });
            return total;
        }

        function calcularTotalVideos() {
            let total = 0;
            canalData.carreras.forEach(carrera => {
                total += carrera.videos.length;
            });
            return total;
        }

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

        // Función para estadísticas con el filtro desplegable
        function generarInfoCanal() {
            const filtroHTML = `
                <div class="filtro-dropdown-canal">
                    <button class="filtro-dropdown-btn" id="filtroDropdownBtn">
                        ${CATEGORIAS.find(c => c.id === filtroActivo).icono} ${CATEGORIAS.find(c => c.id === filtroActivo).nombre} ▼
                    </button>
                    <div class="filtro-dropdown-content" id="filtroDropdownContent">
                        ${CATEGORIAS.map(cat => `
                            <button class="filtro-dropdown-option ${filtroActivo === cat.id ? 'active' : ''}" data-filtro="${cat.id}">
                                ${cat.icono} ${cat.nombre}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
            
            document.getElementById('canalInfo').innerHTML = `
                <img src="${canalData.logo}" class="canal-logo">
                <div class="canal-descripcion">
                    <h2>${canalData.nombre}</h2>
                    <p>${canalData.descripcion}</p>
                    <div class="canal-stats">
                        <span>📺 ${canalData.suscriptores} suscriptores</span>
                        <span>📹 <span id="totalVideos">${calcularTotalVideos()}</span> videos</span>
                        <span>👁️ <span id="totalVistasCanal">${obtenerVistasTotalesCanal()}</span> visitas totales</span>
                        ${filtroHTML}
                    </div>
                </div>
            `;
            
            // Configurar eventos del drop
            const dropdownBtn = document.getElementById('filtroDropdownBtn');
            const dropdownContent = document.getElementById('filtroDropdownContent');
            
            if (dropdownBtn) {
                dropdownBtn.onclick = (e) => {
                    e.stopPropagation();
                    dropdownContent.classList.toggle('show');
                };
            }
            
            document.querySelectorAll('.filtro-dropdown-option').forEach(btn => {
                btn.onclick = (e) => {
                    e.stopPropagation();
                    const nuevoFiltro = btn.getAttribute('data-filtro');
                    filtroActivo = nuevoFiltro;
                    generarInfoCanal();
                    generarCarruseles();
                    dropdownContent.classList.remove('show');
                };
            });
            
            document.addEventListener('click', () => {
                if (dropdownContent) dropdownContent.classList.remove('show');
            });
        }

        function generarCarruseles() {
            const container = document.getElementById('carruselesContainer');
            
            // Filtrar videos por categoría
            const carrerasFiltradas = canalData.carreras.map(carrera => {
                let videosFiltrados = carrera.videos;
                if (filtroActivo !== 'todos') {
                    videosFiltrados = carrera.videos.filter(video => video.categoria === filtroActivo);
                }
                return { ...carrera, videos: videosFiltrados };
            }).filter(carrera => carrera.videos.length > 0);
            
            if (carrerasFiltradas.length === 0) {
                container.innerHTML = `<div class="sin-resultados">
                    <h3>🎬 No hay videos en esta categoría</h3>
                    <p>Próximamente agregaremos más contenido.</p>
                </div>`;
                return;
            }
            
            container.innerHTML = carrerasFiltradas.map(carrera => `
                <div class="carrera-section">
                    <h3 class="carrera-title">🏛️ ${carrera.nombre}</h3>
                    <div class="carousel-container">
                        <div class="carousel-track">
                            ${carrera.videos.map(v => crearTarjetaVideo(v)).join('')}
                        </div>
                        <button class="carousel-btn left">❮</button>
                        <button class="carousel-btn right">❯</button>
                    </div>
                </div>
            `).join('');
            
            inicializarCarruseles();
            setTimeout(actualizarTodasLasVistas, 100);
            actualizarTotalVideos();
            actualizarVistasTotalesCanal();
        }

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
        generarInfoCanal();
        generarCarruseles();

        // Header funcional
        document.getElementById('logoLink').onclick = () => window.ColoNavegar?.('index.html');
        document.getElementById('navInicio').onclick = (e) => { e.preventDefault(); window.ColoNavegar?.('index.html'); };
        document.getElementById('navCOMUNICACIONES').onclick = (e) => { e.preventDefault(); window.ColoNavegar?.('seccion.html?seccion=COMUNICACIONES'); };
        document.getElementById('navInnovacion').onclick = (e) => { e.preventDefault(); window.ColoNavegar?.('seccion.html?seccion=innovacion'); };
        document.getElementById('navBienestar').onclick = (e) => { e.preventDefault(); window.ColoNavegar?.('seccion.html?seccion=bienestar'); };
        document.getElementById('navRealidades').onclick = (e) => { e.preventDefault(); window.ColoNavegar?.('seccion.html?seccion=realidades'); };
        
        const facultadesLinks = document.querySelectorAll('#dropdownFacultades a');
        for (let i = 0; i < facultadesLinks.length; i++) {
            facultadesLinks[i].onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                const id = this.getAttribute('data-id');
                if (id) window.ColoNavegar?.('canal.html?tipo=facultad&id=' + id);
                return false;
            };
        }

        // Modo oscuro
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

        // Panel de accesibilidad
        (function() {
            function iniciarPanel() {
                const btnContraste = document.getElementById('btnContraste');
                if (btnContraste) {
                    btnContraste.addEventListener('click', () => {
                        document.body.classList.toggle('high-contrast');
                        localStorage.setItem('highContrast', document.body.classList.contains('high-contrast'));
                    });
                }
                if (localStorage.getItem('highContrast') === 'true') document.body.classList.add('high-contrast');
            }
            if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciarPanel);
            else iniciarPanel();
        })();
