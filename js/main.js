let amuletos = [];
let indexActual = 0;

// ——— Funciones para detección de móvil y aviso ———
function detectarMovil() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function mostrarAvisoEscritorio() {
  if (detectarMovil()) {
    // Crear el aviso
    const aviso = document.createElement('div');
    aviso.id = 'aviso-escritorio';
    aviso.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        color: white;
        font-family: 'Segoe UI', Arial, sans-serif;
      ">
        <div style="
          background: linear-gradient(145deg, #2c1810, #1a0f08);
          padding: 25px;
          border-radius: 15px;
          text-align: center;
          max-width: 85%;
          border: 3px solid #8b6914;
          box-shadow: 0 0 20px rgba(139, 105, 20, 0.3);
        ">
          <div style="font-size: 24px; margin-bottom: 10px;">🕷️</div>
          <h3 style="margin: 10px 0; color: #d4af37;">Amuletos del Arácnido</h3>
          <p style="margin: 15px 0; font-size: 16px;">Para una experiencia óptima, activa la</p>
          <p style="margin: 10px 0; font-size: 18px; color: #d4af37;"><strong>"Vista de Escritorio"</strong></p>
          <div style="
            background: rgba(139, 105, 20, 0.2);
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
            font-size: 14px;
            line-height: 1.4;
          ">
            <p style="margin: 5px 0;"><strong>Chrome/Edge:</strong> Menú ⋮ → ☑️ "Sitio de escritorio"</p>
            <p style="margin: 5px 0;"><strong>Safari:</strong> Botón AA → "Solicitar sitio de escritorio"</p>
            <p style="margin: 5px 0;"><strong>Firefox:</strong> Menú → ☑️ "Sitio de escritorio"</p>
          </div>
          <button onclick="cerrarAviso()" style="
            background: linear-gradient(145deg, #8b6914, #a67c1a);
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 8px;
            cursor: pointer;
            margin: 10px 5px;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.3s;
          " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            Continuar de todas formas
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(aviso);
  }
}

function cerrarAviso() {
  const aviso = document.getElementById('aviso-escritorio');
  if (aviso) {
    aviso.style.opacity = '0';
    aviso.style.transition = 'opacity 0.3s';
    setTimeout(() => aviso.remove(), 300);
  }
}

// ——— Funciones originales ———
async function cargarAmuletos() {
  try {
    const res = await fetch("data/amuletos.json");
    amuletos = await res.json();
    mostrarAmuleto(indexActual);
    
    // Mostrar aviso después de cargar los datos
    setTimeout(mostrarAvisoEscritorio, 500);
  } catch (error) {
    console.error("Error al cargar los datos de los amuletos:", error);
  }
}

function mostrarAmuleto(index) {
  const amuleto = amuletos[index];

  // ——— Datos principales ———
  document.getElementById("amulet-name").textContent = amuleto.nombre;
  document.getElementById("amulet-image").src = amuleto.imagen;
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
    amuleto.sinergias.forEach(sin => {
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
    });
  } else {
    // No hay sinergias: vaciamos el contenido (o lo ocultamos)
    sinergiasCont.innerHTML = "";
    // Ejemplo de ocultar la sección completa:
    // sinergiasCont.style.display = "none";
  }

  // ——— Recomendaciones ———
  const recomendacionesCont = document.getElementById("amulet-recommendations");
  if (Array.isArray(amuleto.recomendaciones) && amuleto.recomendaciones.length > 0) {
    recomendacionesCont.innerHTML = "<h3>Recomendaciones:</h3>";
    amuleto.recomendaciones.forEach(rec => {
      const contenedor = document.createElement("div");
      contenedor.className = "recomendacion";
      contenedor.innerHTML = `
        <img src="${rec.personaje}" alt="Personaje" class="recomendacion-img" />
        <div class="recomendacion-texto">
          <p>${rec.texto}</p>
        </div>
      `;
      recomendacionesCont.appendChild(contenedor);
    });
  } else {
    // No hay recomendaciones: vaciamos el contenido (o lo ocultamos)
    recomendacionesCont.innerHTML = "";
    // recomendacionesCont.style.display = "none";
  }
}

// Navegación entre amuletos
document.getElementById("prev-btn").addEventListener("click", () => {
  indexActual = (indexActual - 1 + amuletos.length) % amuletos.length;
  mostrarAmuleto(indexActual);
});

document.getElementById("next-btn").addEventListener("click", () => {
  indexActual = (indexActual + 1) % amuletos.length;
  mostrarAmuleto(indexActual);
});

// Inicializar
cargarAmuletos();
