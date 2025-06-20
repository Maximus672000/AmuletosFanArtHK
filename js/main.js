let amuletos = [];
let indexActual = 0;

async function cargarAmuletos() {
  try {
    const res = await fetch("data/amuletos.json");
    amuletos = await res.json();
    mostrarAmuleto(indexActual);
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


