/* ================================ */
/* SISTEMA DE PARTÍCULAS OPTIMIZADO */
/* ================================ */

class ParticleSystem {
  constructor() {
    this.container = null;
    this.particles = [];
    this.particlePool = []; // Pool de partículas reutilizables
    this.maxParticles = this.getMaxParticles();
    this.isRunning = false;
    this.animationId = null;
    this.lastTime = 0;
    this.frameRate = 1000 / 30; // 30 FPS máximo
    
    // Configuración de rendimiento
    this.config = {
      batchSize: 3, // Crear máximo 3 partículas por ciclo
      minInterval: 200, // Intervalo mínimo entre generaciones
      maxInterval: 800, // Intervalo máximo
      poolSize: 20, // Tamaño del pool de reutilización
    };
    
    this.init();
  }
  
  // Determinar número máximo de partículas (reducido para mejor rendimiento)
  getMaxParticles() {
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;
    
    // Detectar dispositivo de bajo rendimiento
    const isLowPerformance = this.detectLowPerformance();
    
    if (isLowPerformance || isSmallMobile) return 25;
    if (isMobile) return 35;
    return 50; // Reducido significativamente
  }
  
  // Detectar dispositivos de bajo rendimiento
  detectLowPerformance() {
    // Detectar mediante user agent y memoria
    const ua = navigator.userAgent.toLowerCase();
    const isOldDevice = ua.includes('android 4') || ua.includes('android 5');
    const hasLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
    
    return isOldDevice || hasLowMemory;
  }
  
  // Inicializar el sistema
  init() {
    this.createContainer();
    this.initializePool();
    this.start();
    this.setupEventListeners();
  }
  
  // Crear contenedor de partículas
  createContainer() {
    this.container = document.createElement('div');
    this.container.className = 'particles-container';
    
    // Optimización: usar transform3d para activar aceleración de hardware
    this.container.style.transform = 'translate3d(0,0,0)';
    this.container.style.willChange = 'transform';
    
    document.body.appendChild(this.container);
  }
  
  // Inicializar pool de partículas
  initializePool() {
    for (let i = 0; i < this.config.poolSize; i++) {
      const particle = this.createParticleElement();
      particle.style.display = 'none';
      this.container.appendChild(particle);
      this.particlePool.push(particle);
    }
  }
  
  // Crear elemento de partícula (sin configurar)
  createParticleElement() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Optimización: preparar para aceleración de hardware
    particle.style.transform = 'translate3d(0,0,0)';
    particle.style.willChange = 'transform, opacity';
    
    return particle;
  }
  
  // Obtener partícula del pool o crear nueva
  getParticle() {
    if (this.particlePool.length > 0) {
      return this.particlePool.pop();
    }
    
    // Si no hay en el pool, crear nueva (pero limitado)
    if (this.container.children.length < this.maxParticles + this.config.poolSize) {
      const particle = this.createParticleElement();
      this.container.appendChild(particle);
      return particle;
    }
    
    return null;
  }
  
  // Devolver partícula al pool
  returnParticle(particle) {
    if (!particle) return;
    
    // Limpiar estilos y clases
    particle.className = 'particle';
    particle.style.display = 'none';
    particle.style.left = '';
    particle.style.animationDuration = '';
    particle.style.animationDelay = '';
    
    // Devolver al pool si no está lleno
    if (this.particlePool.length < this.config.poolSize) {
      this.particlePool.push(particle);
    }
  }
  
  // Configurar partícula para animación
  configureParticle(particle) {
    // Tipos de partícula (distribución simplificada)
    const rand = Math.random();
    if (rand < 0.1) {
      // 10% partículas brillantes
      particle.classList.add('glowing', 'medium');
    } else if (rand < 0.7) {
      // 60% partículas pequeñas
      particle.classList.add('small');
    } else {
      // 30% partículas medianas
      particle.classList.add('medium');
    }
    
    // Posición inicial aleatoria
    const startX = Math.random() * window.innerWidth;
    particle.style.left = startX + 'px';
    particle.style.display = 'block';
    
    // Animación aleatoria (reducidas para mejor rendimiento)
    const animations = ['anim-1', 'anim-2'];
    const animClass = animations[Math.floor(Math.random() * animations.length)];
    particle.classList.add(animClass);
    
    // Duración optimizada
    const minDuration = 6;  // Reducido
    const maxDuration = 15; // Reducido
    const duration = minDuration + Math.random() * (maxDuration - minDuration);
    particle.style.animationDuration = duration + 's';
    
    // Retraso mínimo
    const delay = Math.random() * 1;
    particle.style.animationDelay = delay + 's';
    
    return {
      duration: duration * 1000,
      delay: delay * 1000
    };
  }
  
  // Agregar partícula al sistema
  addParticle() {
    if (this.particles.length >= this.maxParticles) return;
    
    const particle = this.getParticle();
    if (!particle) return;
    
    const timing = this.configureParticle(particle);
    this.particles.push(particle);
    
    // Programar eliminación
    setTimeout(() => {
      this.removeParticle(particle);
    }, timing.duration + timing.delay);
  }
  
  // Eliminar partícula del sistema
  removeParticle(particle) {
    const index = this.particles.indexOf(particle);
    if (index > -1) {
      this.particles.splice(index, 1);
      this.returnParticle(particle);
    }
  }
  
  // Bucle principal optimizado con throttling
  generateParticles() {
    if (!this.isRunning) return;
    
    const now = Date.now();
    
    // Throttling: no generar más rápido que el frameRate
    if (now - this.lastTime < this.frameRate) {
      requestAnimationFrame(() => this.generateParticles());
      return;
    }
    
    this.lastTime = now;
    
    // Generar partículas en lotes pequeños
    const currentParticles = this.particles.length;
    const availableSlots = this.maxParticles - currentParticles;
    const shouldGenerate = Math.random() < 0.3; // Reducir frecuencia
    
    if (shouldGenerate && availableSlots > 0) {
      const batchSize = Math.min(this.config.batchSize, availableSlots);
      for (let i = 0; i < batchSize; i++) {
        this.addParticle();
      }
    }
    
    // Programar siguiente generación con intervalo variable
    const nextInterval = this.config.minInterval + 
                        Math.random() * (this.config.maxInterval - this.config.minInterval);
    
    setTimeout(() => {
      requestAnimationFrame(() => this.generateParticles());
    }, nextInterval);
  }
  
  // Iniciar sistema
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.lastTime = Date.now();
    this.generateParticles();
    
    // Generar partículas iniciales de forma escalonada
    const initialCount = Math.floor(this.maxParticles * 0.3); // Reducido a 30%
    for (let i = 0; i < initialCount; i++) {
      setTimeout(() => {
        this.addParticle();
      }, i * 150); // Más lento
    }
  }
  
  // Detener sistema
  stop() {
    this.isRunning = false;
    
    // Devolver todas las partículas al pool
    this.particles.forEach(particle => {
      this.returnParticle(particle);
    });
    this.particles = [];
  }
  
  // Ajustar sistema según rendimiento dinámico
  resize() {
    const newMaxParticles = this.getMaxParticles();
    
    if (newMaxParticles !== this.maxParticles) {
      this.maxParticles = newMaxParticles;
      
      // Eliminar exceso de partículas
      while (this.particles.length > this.maxParticles) {
        const particle = this.particles.pop();
        this.returnParticle(particle);
      }
    }
  }
  
  // Monitorear rendimiento y ajustar dinámicamente
  monitorPerformance() {
    if (!performance || !performance.now) return;
    
    const startTime = performance.now();
    
    requestAnimationFrame(() => {
      const endTime = performance.now();
      const frameTime = endTime - startTime;
      
      // Si el frame tarda más de 33ms (menos de 30 FPS)
      if (frameTime > 33) {
        // Reducir partículas temporalmente
        this.maxParticles = Math.max(10, this.maxParticles - 5);
        this.config.minInterval += 50;
      } else if (frameTime < 16 && this.maxParticles < this.getMaxParticles()) {
        // Si va fluido, aumentar gradualmente
        this.maxParticles = Math.min(this.getMaxParticles(), this.maxParticles + 2);
        this.config.minInterval = Math.max(200, this.config.minInterval - 25);
      }
    });
  }
  
  // Configurar event listeners
  setupEventListeners() {
    // Ajustar al cambiar tamaño de ventana (con debounce)
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.resize();
      }, 250);
    });
    
    // Pausar cuando la página no es visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stop();
      } else {
        setTimeout(() => this.start(), 500);
      }
    });
    
    // Monitorear rendimiento periódicamente
    setInterval(() => {
      if (this.isRunning) {
        this.monitorPerformance();
      }
    }, 5000);
  }
  
  // Obtener estadísticas de rendimiento
  getStats() {
    return {
      activeParticles: this.particles.length,
      maxParticles: this.maxParticles,
      poolSize: this.particlePool.length,
      totalElements: this.container.children.length,
      isRunning: this.isRunning
    };
  }
}

/* ================================ */
/* INICIALIZACIÓN OPTIMIZADA */
/* ================================ */

// Inicializar con detección de carga de página
document.addEventListener('DOMContentLoaded', () => {
  // Esperar que otros recursos se carguen
  if (document.readyState === 'complete') {
    initParticleSystem();
  } else {
    window.addEventListener('load', initParticleSystem);
  }
});

function initParticleSystem() {
  // Verificar que no haya una instancia previa
  if (window.particleSystem) {
    window.particleSystem.stop();
  }
  
  // Crear nueva instancia
  setTimeout(() => {
    window.particleSystem = new ParticleSystem();
  }, 300);
}

/* ================================ */
/* UTILIDADES MEJORADAS */
/* ================================ */

// Función para alternar partículas
function toggleParticles() {
  if (window.particleSystem) {
    if (window.particleSystem.isRunning) {
      window.particleSystem.stop();
    } else {
      window.particleSystem.start();
    }
  }
}

// Función para obtener estadísticas
function getParticleStats() {
  if (window.particleSystem) {
    console.log('Estadísticas del sistema:', window.particleSystem.getStats());
  }
}

// Hacer disponible globalmente
window.toggleParticles = toggleParticles;
window.getParticleStats = getParticleStats;