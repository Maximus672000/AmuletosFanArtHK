/* ================================ */
/* SISTEMA DE PARTÍCULAS ANIMADAS */
/* ================================ */

class ParticleSystem {
  constructor() {
    this.container = null;
    this.particles = [];
    this.maxParticles = this.getMaxParticles();
    this.isRunning = false;
    this.animationId = null;
    
    this.init();
  }
  
  // Determinar número máximo de partículas según dispositivo
  getMaxParticles() {
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;
    
    if (isSmallMobile) return 150;   // ¡Muchas más en móvil pequeño!
    if (isMobile) return 150;       // ¡Muchas más en móvil!
    return 150;                     // ¡Muchísimas más en desktop!
  }
  
  // Inicializar el sistema
  init() {
    this.createContainer();
    this.start();
    this.setupEventListeners();
  }
  
  // Crear contenedor de partículas
  createContainer() {
    this.container = document.createElement('div');
    this.container.className = 'particles-container';
    document.body.appendChild(this.container);
  }
  
  // Crear una partícula individual
  createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Tipos de partícula (distribución ponderada)
    const rand = Math.random();
    if (rand < 0.05) {
      // 5% partículas brillantes
      particle.classList.add('glowing', 'medium');
    } else if (rand < 0.15) {
      // 10% partículas ambiente
      particle.classList.add('ambient', 'small');
    } else if (rand < 0.6) {
      // 45% partículas pequeñas normales
      particle.classList.add('small');
    } else if (rand < 0.9) {
      // 30% partículas medianas
      particle.classList.add('medium');
    } else {
      // 10% partículas grandes
      particle.classList.add('large');
    }
    
    // Posición inicial aleatoria
    const startX = Math.random() * window.innerWidth;
    particle.style.left = startX + 'px';
    
    // Animación aleatoria
    const animations = ['anim-1', 'anim-2', 'anim-3', 'anim-4'];
    const animClass = animations[Math.floor(Math.random() * animations.length)];
    particle.classList.add(animClass);
    
    // Duración aleatoria (más variedad en la velocidad)
    const minDuration = 8;  // 8 segundos mínimo
    const maxDuration = 25; // 25 segundos máximo
    const duration = minDuration + Math.random() * (maxDuration - minDuration);
    particle.style.animationDuration = duration + 's';
    
    // Retraso aleatorio para evitar sincronización
    const delay = Math.random() * 3;
    particle.style.animationDelay = delay + 's';
    
    return particle;
  }
  
  // Agregar partícula al sistema
  addParticle() {
    if (this.particles.length >= this.maxParticles) return;
    
    const particle = this.createParticle();
    this.container.appendChild(particle);
    this.particles.push(particle);
    
    // Programar eliminación cuando termine la animación
    const animationDuration = parseFloat(particle.style.animationDuration) * 1000;
    const animationDelay = parseFloat(particle.style.animationDelay) * 1000;
    
    setTimeout(() => {
      this.removeParticle(particle);
    }, animationDuration + animationDelay);
  }
  
  // Eliminar partícula del sistema
  removeParticle(particle) {
    const index = this.particles.indexOf(particle);
    if (index > -1) {
      this.particles.splice(index, 1);
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }
  }
  
  // Bucle principal de generación
  generateParticles() {
    if (!this.isRunning) return;
    
    // Generar nueva partícula ocasionalmente
    if (Math.random() < 0.9 && this.particles.length < this.maxParticles) {
      this.addParticle();
    }
    
    // Programar siguiente generación
    const nextInterval = 100 + Math.random() * 300;
    setTimeout(() => {
      this.generateParticles();
    }, nextInterval);
  }
  
  // Iniciar sistema
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.generateParticles();
    
    // Generar MUCHAS partículas iniciales
    const initialCount = Math.floor(this.maxParticles * 0.4); // 40% al inicio
    for (let i = 0; i < initialCount; i++) {
      setTimeout(() => {
        this.addParticle();
      }, i * 100); // Aparecen cada 100ms al inicio
    }
  }
  
  // Detener sistema
  stop() {
    this.isRunning = false;
    
    // Limpiar partículas existentes
    this.particles.forEach(particle => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    });
    this.particles = [];
  }
  
  // Ajustar sistema según tamaño de ventana
  resize() {
    const newMaxParticles = this.getMaxParticles();
    
    if (newMaxParticles !== this.maxParticles) {
      this.maxParticles = newMaxParticles;
      
      // Si hay demasiadas partículas, eliminar algunas
      while (this.particles.length > this.maxParticles) {
        const particle = this.particles[this.particles.length - 1];
        this.removeParticle(particle);
      }
    }
  }
  
  // Configurar event listeners
  setupEventListeners() {
    // Ajustar al cambiar tamaño de ventana
    window.addEventListener('resize', () => {
      this.resize();
    });
    
    // Pausar cuando la página no es visible (optimización)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stop();
      } else {
        this.start();
      }
    });
  }
}

/* ================================ */
/* INICIALIZACIÓN */
/* ================================ */

// Inicializar sistema cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Esperar un poco para que otros scripts se carguen
  setTimeout(() => {
    window.particleSystem = new ParticleSystem();
  }, 500);
});

// También inicializar si el DOM ya está listo
if (document.readyState === 'loading') {
  // Ya configurado arriba
} else {
  // DOM ya está listo
  setTimeout(() => {
    if (!window.particleSystem) {
      window.particleSystem = new ParticleSystem();
    }
  }, 500);
}

/* ================================ */
/* UTILIDADES ADICIONALES */
/* ================================ */

// Función para alternar partículas (por si quieres un botón de control)
function toggleParticles() {
  if (window.particleSystem) {
    if (window.particleSystem.isRunning) {
      window.particleSystem.stop();
    } else {
      window.particleSystem.start();
    }
  }
}

// Hacer disponible globalmente para debugging
window.toggleParticles = toggleParticles;