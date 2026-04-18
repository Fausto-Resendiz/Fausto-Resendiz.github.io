// Garantizar que la página siempre cargue en el top
window.addEventListener('beforeunload', () => { window.scrollTo(0, 0); });
history.scrollRestoration = 'manual';

// ================================================
// MENU RESPONSIVE
// ================================================
let menuVisible = false;

function mostrarOcultarMenu() {
    const nav = document.getElementById("nav");
    menuVisible = !menuVisible;
    nav.className = menuVisible ? "responsive" : "";
}

function seleccionar() {
    document.getElementById("nav").className = "";
    menuVisible = false;
}

// ================================================
// ANIMACIÓN DE HABILIDADES (scroll trigger)
// ================================================
function efectoHabilidades() {
    const skillsSection = document.getElementById("skills");
    if (!skillsSection) return;

    const distanciaSkills = window.innerHeight - skillsSection.getBoundingClientRect().top;

    if (distanciaSkills >= 300) {
        const habilidades = document.querySelectorAll(".progreso");
        const skillClasses = [
            "javascript", "htmlcss", "unrealengine", "opentoonz", "blender",
            "comunicacion", "trabajo", "creatividad", "proyectM", "liderazgo"
        ];
        habilidades.forEach((habilidad, index) => {
            if (skillClasses[index]) {
                habilidad.classList.add(skillClasses[index]);
            }
        });
    }
}

window.addEventListener('scroll', efectoHabilidades);

// ================================================
// VIDEOS – GALERÍA DE ANIMACIONES (hover)
// ================================================
document.addEventListener('DOMContentLoaded', function () {
    const videoContainers = document.querySelectorAll('.pelis .video-container');

    videoContainers.forEach(container => {
        const video = container.querySelector('video');
        if (!video) return;

        // Precarga cuando entra en el viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.load();
                    observer.unobserve(container);
                }
            });
        }, { threshold: 0.1 });
        observer.observe(container);

        container.addEventListener('mouseenter', function () {
            video.currentTime = 0;
            video.play().catch(() => {
                video.muted = true;
                video.play().then(() => { video.muted = false; }).catch(e => console.log("No se pudo reproducir:", e));
            });
        });

        container.addEventListener('mouseleave', function () {
            video.pause();
            video.currentTime = 0;
        });
    });
});

// ================================================
// XBOX LAUNCHER – CARRUSEL DE PROYECTOS PERSONALES
// ================================================
document.addEventListener('DOMContentLoaded', function () {
    const rail       = document.getElementById('launcherRail');
    const bg         = document.getElementById('launcherBg');
    const infoTitle  = document.getElementById('launcherTitle');
    const infoDesc   = document.getElementById('launcherDesc');
    const infoBadge  = document.getElementById('launcherBadge');
    const infoTags   = document.getElementById('launcherTags');
    const dotsWrap   = document.getElementById('launcherDots');
    const btnPrev    = document.getElementById('launcherPrev');
    const btnNext    = document.getElementById('launcherNext');

    if (!rail) return; // Si no existe la sección, salir

    const cards = Array.from(rail.querySelectorAll('.launcher-card'));
    let activeIndex = 0;

    // ── Crear puntos indicadores ──
    cards.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'launcher-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => activarCard(i));
        dotsWrap.appendChild(dot);
    });

    // ── Activar una tarjeta ──
    function activarCard(index) {
        if (index < 0) index = cards.length - 1;
        if (index >= cards.length) index = 0;
        activeIndex = index;

        // Clases activas
        cards.forEach((c, i) => {
            c.classList.toggle('active', i === activeIndex);
            const vid = c.querySelector('video');
            if (vid) {
                if (i === activeIndex) {
                    vid.currentTime = 0;
                    vid.play().catch(() => { vid.muted = true; vid.play().catch(() => {}); });
                } else {
                    vid.pause();
                    vid.currentTime = 0;
                }
            }
        });

        // Puntos
        dotsWrap.querySelectorAll('.launcher-dot').forEach((d, i) => {
            d.classList.toggle('active', i === activeIndex);
        });

        // Panel de info
        const card = cards[activeIndex];
        const title = card.dataset.title  || 'Sin título';
        const desc  = card.dataset.desc   || '';
        const badge = card.dataset.badge  || '';
        const tags  = card.dataset.tags   ? card.dataset.tags.split(',') : [];
        const bgImg = card.dataset.bg     || '';

        infoTitle.textContent = title;
        infoDesc.textContent  = desc;
        infoBadge.textContent = badge;

        // Color del badge según estado
        infoBadge.className = 'launcher-badge';
        if (badge === 'TERMINADO')      infoBadge.classList.add('done');
        else if (badge === 'PROTOTIPO') infoBadge.classList.add('proto');
        else                            infoBadge.classList.add('wip');

        // Tags
        infoTags.innerHTML = '';
        tags.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'launcher-tag';
            span.textContent = tag.trim();
            infoTags.appendChild(span);
        });

        // Fondo difuminado
        if (bgImg) {
            bg.style.backgroundImage = `url(${bgImg})`;
        } else {
            bg.style.backgroundImage = 'none';
        }

        // Scroll suave hacia la tarjeta activa (solo si el usuario ya interactuó)
        if (activarCard._iniciado) {
            cards[activeIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }

    // ── Clicks en tarjetas ──
    cards.forEach((card, i) => {
        card.addEventListener('click', () => { activarCard._iniciado = true; activarCard(i); });
    });

    // ── Flechas ──
    btnPrev.addEventListener('click', () => { activarCard._iniciado = true; activarCard(activeIndex - 1); });
    btnNext.addEventListener('click', () => { activarCard._iniciado = true; activarCard(activeIndex + 1); });

    // ── Teclado ──
    document.addEventListener('keydown', (e) => {
        const launcher = document.getElementById('xboxLauncher');
        if (!launcher) return;
        const rect = launcher.getBoundingClientRect();
        const visible = rect.top < window.innerHeight && rect.bottom > 0;
        if (!visible) return;
        if (e.key === 'ArrowLeft')  { activarCard._iniciado = true; activarCard(activeIndex - 1); }
        if (e.key === 'ArrowRight') { activarCard._iniciado = true; activarCard(activeIndex + 1); }
    });

    // ── Swipe táctil ──
    let touchStartX = 0;
    rail.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    rail.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
            activarCard._iniciado = true;
            if (diff > 0) activarCard(activeIndex + 1);
            else          activarCard(activeIndex - 1);
        }
    });

    // Inicializar con la primera tarjeta
    activarCard(0);
});

// ================================================
// CONTACTO – ENVIAR POR WHATSAPP
// ================================================
function enviarWhatsApp() {
    const numero   = '525541338005'; // Número con código de país (sin + ni espacios)
    const nombre   = (document.getElementById('waNombre')?.value  || '').trim();
    const mensaje  = (document.getElementById('waMensaje')?.value || '').trim();

    if (!mensaje) {
        alert('Por favor escribe un mensaje antes de enviar.');
        return;
    }

    const textoFinal = nombre
        ? `Hola Fausto, soy ${nombre}.\n\n${mensaje}`
        : `Hola Fausto!\n\n${mensaje}`;

    const url = `https://wa.me/${numero}?text=${encodeURIComponent(textoFinal)}`;
    window.open(url, '_blank');
}