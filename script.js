// Control del menú responsive
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

// Animación de habilidades
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

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Configuración inicial si es necesaria
});

window.addEventListener('scroll', efectoHabilidades);

// Manejo del formulario de contacto (si se implementa)
document.querySelector('.contacto button')?.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Mensaje enviado (simulado)');
    // Aquí iría la lógica real para enviar el formulario
});

// Control de videos en películas favoritas - Versión corregida
document.addEventListener('DOMContentLoaded', function() {
    const videoContainers = document.querySelectorAll('.pelis .video-container');
    
    videoContainers.forEach(container => {
        const video = container.querySelector('video');
        
        // Precarga el video cuando está visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.load();
                    observer.unobserve(container);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(container);
        
        // Control de hover
        container.addEventListener('mouseenter', function() {
            video.currentTime = 0;
            video.play().catch(e => {
                // Fallback para navegadores que bloquean autoplay
                video.muted = true;
                video.play().then(() => {
                    video.muted = false;
                }).catch(e => console.log("No se pudo reproducir:", e));
            });
        });
        
        container.addEventListener('mouseleave', function() {
            video.pause();
            video.currentTime = 0;
        });
    });
});