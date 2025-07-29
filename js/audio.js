/* ================================ */
/* SISTEMA DE AUDIO DE FONDO */
/* ================================ */

class AudioSystem {
  constructor() {
    this.currentAudio = null;
    this.currentTrackIndex = 0;
    this.isPlaying = false;
    this.volume = 0.3; // Volumen por defecto (30%)
    
    // Lista de canciones (agrega las rutas de tus archivos de audio)
    this.playlist = [
  'audio/Song1FAnArtAmuletos.mp3',
  'audio/HollowKnightOSTGreenpath.mp3',
  'audio/HollowKnightOSTWhitePalace.mp3',
  'audio/HollowKnightOSTKingdomsEdge.mp3',
  'audio/HollowKnightOSTQueensGardens.mp3',
  'audio/HollowKnightOSTEnterHallownest.mp3',
  'audio/HollowKnightOSTHollowKnight.mp3',
  'audio/HollowKnightOSTRestingGrounds.mp3',
  'audio/HollowKnightOSTCityofTears.mp3'
    ];
    
    this.init();
  }
  
  // Inicializar el sistema de audio
  init() {
    // Crear elemento de audio
    this.currentAudio = new Audio();
    this.currentAudio.volume = this.volume;
    this.currentAudio.loop = false; // No loop individual, manejamos nosotros
    
    // Configurar eventos
    this.setupEventListeners();
    
    // Intentar reproducir automáticamente
    this.startAutoplay();
  }
  
  // Configurar eventos del reproductor
  setupEventListeners() {
    // Cuando termine una canción, reproducir la siguiente automáticamente
    this.currentAudio.addEventListener('ended', () => {
      console.log('Canción terminada, reproduciendo siguiente...');
      this.playNext();
    });
    
    // Manejar errores de carga
    this.currentAudio.addEventListener('error', (e) => {
      console.log('Error cargando audio:', e);
      console.log('Intentando con la siguiente canción...');
      setTimeout(() => {
        this.playNext(); // Intentar con la siguiente canción después de un delay
      }, 1000);
    });
    
    // Cuando la canción esté lista para reproducir
    this.currentAudio.addEventListener('canplaythrough', () => {
      console.log('Audio listo para reproducir');
      if (!this.isPlaying) {
        this.play();
      }
    });
    
    // Cuando empiece a reproducir
    this.currentAudio.addEventListener('play', () => {
      console.log(`Reproduciendo: ${this.playlist[this.currentTrackIndex]}`);
    });
  }
  
  // Cargar canción por índice
  loadTrack(index) {
    if (index >= 0 && index < this.playlist.length) {
      this.currentTrackIndex = index;
      this.isPlaying = false; // Resetear estado
      this.currentAudio.src = this.playlist[index];
      console.log(`Cargando canción ${index + 1}/${this.playlist.length}: ${this.playlist[index]}`);
    } else {
      console.error('Índice de canción inválido:', index);
    }
  }
  
  // Reproducir canción actual
  play() {
    if (this.currentAudio && !this.isPlaying) {
      this.currentAudio.play()
        .then(() => {
          this.isPlaying = true;
          console.log('Audio iniciado correctamente');
        })
        .catch(error => {
          console.log('Error al reproducir audio:', error);
          // Los navegadores modernos requieren interacción del usuario
          this.setupUserInteraction();
        });
    }
  }
  
  // Pausar reproducción
  pause() {
    if (this.currentAudio && this.isPlaying) {
      this.currentAudio.pause();
      this.isPlaying = false;
    }
  }
  
  // Reproducir siguiente canción
  playNext() {
    this.pause(); // Pausar canción actual
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
    this.loadTrack(this.currentTrackIndex);
    
    // Esperar un poco antes de reproducir la siguiente
    setTimeout(() => {
      this.play();
    }, 500);
  }
  
  // Reproducir canción anterior
  playPrevious() {
    this.pause(); // Pausar canción actual
    this.currentTrackIndex = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
    this.loadTrack(this.currentTrackIndex);
    
    // Esperar un poco antes de reproducir la anterior
    setTimeout(() => {
      this.play();
    }, 500);
  }
  
  // Cambiar volumen (0.0 a 1.0)
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.currentAudio) {
      this.currentAudio.volume = this.volume;
    }
  }
  
  // Configurar reproducción automática después de interacción del usuario
  setupUserInteraction() {
    const startAudio = () => {
      this.play();
      // Remover listeners después de la primera interacción
      document.removeEventListener('click', startAudio);
      document.removeEventListener('keydown', startAudio);
      document.removeEventListener('touchstart', startAudio);
    };
    
    // Escuchar cualquier interacción del usuario
    document.addEventListener('click', startAudio);
    document.addEventListener('keydown', startAudio);
    document.addEventListener('touchstart', startAudio);
    
    console.log('Esperando interacción del usuario para iniciar audio...');
  }
  
  // Intentar reproducción automática
  startAutoplay() {
    // Cargar primera canción
    this.loadTrack(0);
    
    // Esperar un poco antes de intentar reproducir
    setTimeout(() => {
      this.play();
    }, 1000);
  }
  
  // Alternar reproducción/pausa
  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }
}

/* ================================ */
/* INICIALIZACIÓN */
/* ================================ */

let audioSystem = null;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Esperar un poco para que la página se cargue completamente
  setTimeout(() => {
    audioSystem = new AudioSystem();
    
    // Hacer disponible globalmente
    window.audioSystem = audioSystem;
    
    console.log('Sistema de audio iniciado');
  }, 2000); // 2 segundos de espera
});

/* ================================ */
/* CONTROLES WASD */
/* ================================ */

// Controles de teclado usando WASD
document.addEventListener('keydown', (e) => {
  if (!audioSystem) return;
  
  // Convertir a minúsculas para manejar tanto mayúsculas como minúsculas
  const key = e.key.toLowerCase();
  
  switch(key) {
    case ' ': // Espaciadora para pausar/reproducir
      e.preventDefault();
      audioSystem.toggle();
      console.log('Audio toggle (Espacio)');
      break;
    case 'w': // W - Subir volumen
      e.preventDefault();
      audioSystem.setVolume(audioSystem.volume + 0.1);
      console.log(`Volumen subido: ${Math.round(audioSystem.volume * 100)}%`);
      break;
    case 's': // S - Bajar volumen
      e.preventDefault();
      audioSystem.setVolume(audioSystem.volume - 0.1);
      console.log(`Volumen bajado: ${Math.round(audioSystem.volume * 100)}%`);
      break;
    case 'd': // D - Siguiente canción
      e.preventDefault();
      audioSystem.playNext();
      console.log('Siguiente canción (D)');
      break;
    case 'a': // A - Canción anterior
      e.preventDefault();
      audioSystem.playPrevious();
      console.log('Canción anterior (A)');
      break;
  }
});

/* ================================ */
/* FUNCIONES GLOBALES ÚTILES */
/* ================================ */

// Funciones para controlar desde otros scripts
function toggleAudio() {
  if (audioSystem) audioSystem.toggle();
}

function nextTrack() {
  if (audioSystem) audioSystem.playNext();
}

function previousTrack() {
  if (audioSystem) audioSystem.playPrevious();
}

function setAudioVolume(volume) {
  if (audioSystem) audioSystem.setVolume(volume);
}

// Función para mostrar ayuda de controles
function showAudioControls() {
  console.log('=== CONTROLES DE AUDIO ===');
  console.log('Espacio: Play/Pausa');
  console.log('W: Subir volumen');
  console.log('S: Bajar volumen');
  console.log('D: Siguiente canción');
  console.log('A: Canción anterior');
  console.log('========================');
}

// Hacer disponible globalmente
window.toggleAudio = toggleAudio;
window.nextTrack = nextTrack;
window.previousTrack = previousTrack;
window.setAudioVolume = setAudioVolume;
window.showAudioControls = showAudioControls;