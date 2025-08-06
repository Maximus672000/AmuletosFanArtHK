let amuletos = [];
let indexActual = 0;

// ================================
// FUNCIONES DE PANTALLA DE CARGA
// ================================

function showLoadingScreen() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) {
    overlay.classList.remove('hidden');
  }
}

function hideLoadingScreen() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) {
    overlay.classList.add('hidden');
  }
}

// Función para crear la pantalla de carga dinámicamente
function createLoadingScreenAdvanced() {
  const particulas = [];
  const numeroParticulas = 15;
  
  for (let i = 0; i < numeroParticulas; i++) {
    // Calcular posición inicial en círculo
    const angulo = (i / numeroParticulas) * 360;
    const radio = 70; // Radio base para posicionamiento
    
    // Alternar tamaños y crear variaciones
    let sizeClass = '';
    if (i % 4 === 0) sizeClass = 'size-small';
    else if (i % 4 === 1) sizeClass = 'size-large';
    
    particulas.push(`<div class="loading-particle ${sizeClass}" style="
      left: 50%; 
      top: 50%;
      transform: translate(-50%, -50%) translate(${Math.cos(angulo * Math.PI / 180) * radio}px, ${Math.sin(angulo * Math.PI / 180) * radio}px);
    "></div>`);
  }
  
  const loadingHTML = `
    <div class="loading-overlay hidden" id="loadingOverlay">
      <div class="loading-content">
        <div class="loading-circle">
          ${particulas.join('')}
        </div>
        <div class="loading-text">CARGANDO AMULETO</div>
        <div class="loading-subtext">Bienvenido, pequeño fantasma.</div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', loadingHTML);
}

// ================================
// FUNCIONES PRINCIPALES
// ================================

async function cargarAmuletos() {
  try {
    const res = await fetch("data/amuletos.json");
    amuletos = await res.json();
    mostrarAmuleto(indexActual);
  } catch (error) {
    console.error("Error al cargar los datos de los amuletos:", error);
  }
}

async function mostrarAmuleto(index) {
  // Mostrar pantalla de carga
  showLoadingScreen();
  
  // Simular pequeño delay para mostrar la carga (opcional)
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const amuleto = amuletos[index];

  try {
    // ——— Datos principales ———
    document.getElementById("amulet-name").textContent = amuleto.nombre;
    
    // Cargar imagen de forma asíncrona
    const imagen = document.getElementById("amulet-image");
    await cargarImagen(imagen, amuleto.imagen);
    
    document.getElementById("amulet-notches").textContent = amuleto.muescas;
    document.getElementById("amulet-rarity").textContent = amuleto.rareza;

    // ——— Historia con saltos de línea ———
    const historiaHTML = amuleto.historia
      .split("\n")
      .map(parrafo => `<p>${parrafo}</p>`)
      .join("");
    document.getElementById("amulet-history").innerHTML = historiaHTML;

    // ——— Efectos ———
    const efectosLista = document.getElementById("amulet-effects");
    efectosLista.innerHTML = "";
    if (Array.isArray(amuleto.efectos)) {
      amuleto.efectos.forEach(efecto => {
        const li = document.createElement("li");
        li.textContent = efecto;
        efectosLista.appendChild(li);
      });
    }

    // ——— Sinergias ———
    const sinergiasCont = document.getElementById("amulet-synergies");
    if (Array.isArray(amuleto.sinergias) && amuleto.sinergias.length > 0) {
      sinergiasCont.innerHTML = "<h3>Sinergias:</h3>";
      
      // Cargar sinergias con sus imágenes
      for (const sin of amuleto.sinergias) {
        const contenedor = document.createElement("div");
        contenedor.className = "sinergia";
        contenedor.innerHTML = `
          <div class="sinergia-texto">
            <h4>${sin.nombre}</h4>
            <p>${sin.descripcion}</p>
          </div>
          <img src="${sin.imagen}" alt="${sin.nombre}" class="sinergia-img" />
        `;
        sinergiasCont.appendChild(contenedor);
        
        // Cargar imagen de sinergia de forma asíncrona
        const sinergiaImg = contenedor.querySelector('.sinergia-img');
        await cargarImagen(sinergiaImg, sin.imagen);
      }
    } else {
      sinergiasCont.innerHTML = "";
    }

    // ——— Recomendaciones ———
    const recomendacionesCont = document.getElementById("amulet-recommendations");
    if (Array.isArray(amuleto.recomendaciones) && amuleto.recomendaciones.length > 0) {
      recomendacionesCont.innerHTML = "<h3>Recomendaciones:</h3>";
      
      // Cargar recomendaciones con sus imágenes
      for (const rec of amuleto.recomendaciones) {
        const contenedor = document.createElement("div");
        contenedor.className = "recomendacion";
        contenedor.innerHTML = `
          <img src="${rec.personaje}" alt="Personaje" class="recomendacion-img" />
          <div class="recomendacion-texto">
            <p>${rec.texto}</p>
          </div>
        `;
        recomendacionesCont.appendChild(contenedor);
        
        // Cargar imagen de recomendación de forma asíncrona
        const recImg = contenedor.querySelector('.recomendacion-img');
        await cargarImagen(recImg, rec.personaje);
      }
    } else {
      recomendacionesCont.innerHTML = "";
    }

    // Pequeño delay adicional para asegurar que todo esté renderizado
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Ocultar pantalla de carga
    hideLoadingScreen();
    
  } catch (error) {
    console.error("Error al mostrar el amuleto:", error);
    hideLoadingScreen(); // Asegurar que se oculte incluso si hay error
  }
}

// Función auxiliar para cargar imágenes de forma asíncrona
function cargarImagen(imgElement, src) {
  return new Promise((resolve) => {
    if (!imgElement || !src) {
      resolve();
      return;
    }

    // 👇 Limpio antes de todo
    imgElement.src = "";
    imgElement.classList.add("loading");  // si quieres mostrar un spinner con CSS

    const tmp = new Image();
    tmp.onload = () => {
      imgElement.src = src;
      imgElement.classList.remove("loading");
      resolve();
    };
    tmp.onerror = () => {
      console.warn(`Error cargando imagen: ${src}`);
      resolve();
    };

    // fallback en 2 s
    setTimeout(() => {
      if (!imgElement.src) imgElement.src = src;
      resolve();
    }, 2000);

    tmp.src = src;
  });
}


// ================================
// NAVEGACIÓN MEJORADA
// ================================

async function navegarAnterior() {
  // Deshabilitar botones durante la navegación
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  prevBtn.style.pointerEvents = 'none';
  nextBtn.style.pointerEvents = 'none';
  
  indexActual = (indexActual - 1 + amuletos.length) % amuletos.length;
  await mostrarAmuleto(indexActual);
  
  // Rehabilitar botones
  prevBtn.style.pointerEvents = 'auto';
  nextBtn.style.pointerEvents = 'auto';
}

async function navegarSiguiente() {
  // Deshabilitar botones durante la navegación
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  prevBtn.style.pointerEvents = 'none';
  nextBtn.style.pointerEvents = 'none';
  
  indexActual = (indexActual + 1) % amuletos.length;
  await mostrarAmuleto(indexActual);
  
  // Rehabilitar botones
  prevBtn.style.pointerEvents = 'auto';
  nextBtn.style.pointerEvents = 'auto';
}

// ================================
// INICIALIZACIÓN
// ================================

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
  // Crear pantalla de carga
  createLoadingScreenAdvanced();
  
  // Configurar navegación
  document.getElementById("prev-btn").addEventListener("click", navegarAnterior);
  document.getElementById("next-btn").addEventListener("click", navegarSiguiente);
  
  // Cargar datos iniciales
  await cargarAmuletos();
});

// También para compatibilidad si el DOM ya está listo
if (document.readyState === 'loading') {
  // Ya configurado arriba
} else {
  // DOM ya listo
  setTimeout(async () => {
    if (!document.getElementById('loadingOverlay')) {
      createLoadingScreenAdvanced();
      document.getElementById("prev-btn").addEventListener("click", navegarAnterior);
      document.getElementById("next-btn").addEventListener("click", navegarSiguiente);
      await cargarAmuletos();
    }
  }, 100);
}

// ================================
// FUNCIONES ADICIONALES
// ================================

// Función para forzar mostrar/ocultar loading (para debugging)
window.debugLoading = {
  show: showLoadingScreen,
  hide: hideLoadingScreen
};