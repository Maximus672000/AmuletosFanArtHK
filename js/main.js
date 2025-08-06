// ================================
// VARIABLES GLOBALES
// ================================
let amuletos = [];
let indexActual = 0;

// ================================
// PANTALLA DE CARGA
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

// Crear pantalla de carga avanzada
function createLoadingScreenAdvanced() {
  const particulas = [];
  const numeroParticulas = 15;

  for (let i = 0; i < numeroParticulas; i++) {
    const angulo = (i / numeroParticulas) * 360;
    const radio = 70;
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
  showLoadingScreen();
  await new Promise(resolve => setTimeout(resolve, 300));
  const amuleto = amuletos[index];

  try {
    // Datos principales
    document.getElementById("amulet-name").textContent = amuleto.nombre;

    // Imagen
    const imagen = document.getElementById("amulet-image");
    await cargarImagen(imagen, amuleto.imagen);

    document.getElementById("amulet-notches").textContent = amuleto.muescas;
    document.getElementById("amulet-rarity").textContent = amuleto.rareza;

    // Historia
    const historiaHTML = amuleto.historia
      .split("\n")
      .map(parrafo => `<p>${parrafo}</p>`)
      .join("");
    document.getElementById("amulet-history").innerHTML = historiaHTML;

    // Efectos
    const efectosLista = document.getElementById("amulet-effects");
    efectosLista.innerHTML = "";
    if (Array.isArray(amuleto.efectos)) {
      amuleto.efectos.forEach(efecto => {
        const li = document.createElement("li");
        li.textContent = efecto;
        efectosLista.appendChild(li);
      });
    }

    // Sinergias
    const sinergiasCont = document.getElementById("amulet-synergies");
    if (Array.isArray(amuleto.sinergias) && amuleto.sinergias.length > 0) {
      sinergiasCont.innerHTML = "<h3>Sinergias:</h3>";
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
        const sinergiaImg = contenedor.querySelector('.sinergia-img');
        await cargarImagen(sinergiaImg, sin.imagen);
      }
    } else {
      sinergiasCont.innerHTML = "";
    }

    // Recomendaciones
    const recomendacionesCont = document.getElementById("amulet-recommendations");
    if (Array.isArray(amuleto.recomendaciones) && amuleto.recomendaciones.length > 0) {
      recomendacionesCont.innerHTML = "<h3>Recomendaciones:</h3>";
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
        const recImg = contenedor.querySelector('.recomendacion-img');
        await cargarImagen(recImg, rec.personaje);
      }
    } else {
      recomendacionesCont.innerHTML = "";
    }

    await new Promise(resolve => setTimeout(resolve, 200));
    hideLoadingScreen();

    // Precarga imágenes del anterior y siguiente amuleto
    if (amuletos[index + 1]) precargarImagen(amuletos[index + 1].imagen);
    if (amuletos[index - 1]) precargarImagen(amuletos[index - 1].imagen);

  } catch (error) {
    console.error("Error al mostrar el amuleto:", error);
    hideLoadingScreen();
  }
}

// ================================
// UTILIDADES
// ================================

function cargarImagen(imgElement, src) {
  const svgPlaceholder = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><rect width="100%" height="100%" fill="#222"/><text x="50%" y="50%" font-size="18" fill="#fff" text-anchor="middle" alignment-baseline="middle">Sin imagen</text></svg>';
  return new Promise((resolve) => {
    if (!imgElement || !src) {
      imgElement.src = svgPlaceholder;
      resolve();
      return;
    }
    if (imgElement.src === src) {
      resolve();
      return;
    }
    imgElement.onload = () => resolve();
    imgElement.onerror = () => {
      imgElement.src = svgPlaceholder;
      resolve();
    };
    imgElement.src = src;
  });
}

// Precarga imágenes adyacentes para navegación más fluida
function precargarImagen(src) {
  if (!src) return;
  const img = new Image();
  img.src = src;
}

// ================================
// NAVEGACIÓN
// ================================

async function navegarAnterior() {
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  prevBtn.style.pointerEvents = 'none';
  nextBtn.style.pointerEvents = 'none';

  indexActual = (indexActual - 1 + amuletos.length) % amuletos.length;
  await mostrarAmuleto(indexActual);

  prevBtn.style.pointerEvents = 'auto';
  nextBtn.style.pointerEvents = 'auto';
}

async function navegarSiguiente() {
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  prevBtn.style.pointerEvents = 'none';
  nextBtn.style.pointerEvents = 'none';

  indexActual = (indexActual + 1) % amuletos.length;
  await mostrarAmuleto(indexActual);

  prevBtn.style.pointerEvents = 'auto';
  nextBtn.style.pointerEvents = 'auto';
}

// ================================
// INICIALIZACIÓN
// ================================

function inicializar() {
  createLoadingScreenAdvanced();
  document.getElementById("prev-btn").addEventListener("click", navegarAnterior);
  document.getElementById("next-btn").addEventListener("click", navegarSiguiente);
  cargarAmuletos();
}

document.addEventListener('DOMContentLoaded', inicializar);

if (document.readyState !== 'loading') {
  setTimeout(() => {
    if (!document.getElementById('loadingOverlay')) {
      inicializar();
    }
  }, 100);
}

// ================================
// DEBUG
// ================================

window.debugLoading = {
  show: showLoadingScreen,
  hide: hideLoadingScreen
};