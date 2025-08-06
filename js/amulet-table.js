// ================================
// TABLA DE NAVEGACIÓN DE AMULETOS
// ================================

let amuletTableData = [];
let currentSelectedIndex = 0;

// ================================
// FUNCIONES PRINCIPALES
// ================================

/**
 * Inicializa la tabla de navegación
 */
function initAmuletTable() {
  createNavigationButton();
  createTableOverlay();
  setupEventListeners();
  console.log('🎮 Tabla de navegación de amuletos inicializada - Estilo Hollow Knight');
}

/**
 * Crea el botón de navegación
 */
function createNavigationButton() {
  // Buscar donde insertar el botón siguiendo la estructura del CSS principal
  let insertionPoint = null;
  
  // Primero buscar si existe la sección de recomendaciones
  const recommendationsSection = document.getElementById('amulet-recommendations');
  if (recommendationsSection && recommendationsSection.innerHTML.trim() !== '') {
    insertionPoint = recommendationsSection;
  } else {
    // Si no hay recomendaciones, buscar la sección de sinergias
    const synergiesSection = document.getElementById('amulet-synergies');
    if (synergiesSection && synergiesSection.innerHTML.trim() !== '') {
      insertionPoint = synergiesSection;
    } else {
      // Buscar cualquier sección con clase bordered-section
      const borderedSections = document.querySelectorAll('.bordered-section');
      if (borderedSections.length > 0) {
        insertionPoint = borderedSections[borderedSections.length - 1];
      } else {
        // Como último recurso, insertar antes del footer o al final del contenedor principal
        const main = document.getElementById('amulet-container') || 
                    document.querySelector('.page-frame') || 
                    document.querySelector('main') || 
                    document.body;
        if (main) {
          insertionPoint = main.lastElementChild || main;
        }
      }
    }
  }
  
  if (!insertionPoint) {
    console.warn('⚠️ No se pudo encontrar un lugar para insertar el botón de navegación');
    return;
  }
  
  // Crear el contenedor del botón con clase para seguir el estilo general
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'amulet-navigation-container bordered-section';
  buttonContainer.innerHTML = `
    <div class="section-frame">
      <div class="corner-tl"></div>
      <div class="corner-tr"></div>
      <div class="corner-bl"></div>
      <div class="corner-br"></div>
    </div>
    <button class="amulet-nav-button" id="amulet-nav-btn">
      <span style="margin-right: 8px;">𖦹</span>Navegación
    </button>
  `;
  
  // Insertar después del punto de inserción
  insertionPoint.parentNode.insertBefore(buttonContainer, insertionPoint.nextSibling);
  
  console.log('✅ Botón de navegación creado exitosamente');
}

/**
 * Crea la tabla overlay con el estilo mejorado
 */
function createTableOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'amulet-table-overlay';
  overlay.id = 'amulet-table-overlay';
  
  overlay.innerHTML = `
    <div class="amulet-table-container">
      <div class="amulet-table-header">
        <h2 class="amulet-table-title">
          <span style="margin-right: 10px;"> </span>Amuletos del Arácnido
        </h2>
        <button class="amulet-table-close" id="amulet-table-close" title="Cerrar tabla">✕</button>
      </div>
      <div class="amulet-table-scroll">
        <div class="amulet-table" id="amulet-table-grid">
          <!-- Los amuletos se insertarán aquí dinámicamente -->
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  console.log('✅ Overlay de tabla creado exitosamente');
}

/**
 * Configura los event listeners
 */
function setupEventListeners() {
  // Botón para mostrar la tabla
  const navButton = document.getElementById('amulet-nav-btn');
  if (navButton) {
    navButton.addEventListener('click', showAmuletTable);
    console.log('🎯 Event listener del botón de navegación configurado');
  }
  
  // CORRECCIÓN: Botón para cerrar la tabla con stopPropagation
  const closeButton = document.getElementById('amulet-table-close');
  if (closeButton) {
    // Usar capture para que se ejecute antes que otros listeners
    closeButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      hideAmuletTable();
    }, { capture: true });
    
    // Listener adicional para asegurar que siempre funcione
    closeButton.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }, { capture: true });
    
    console.log('🎯 Event listener del botón de cerrar configurado con prioridad');
  }
  
  // Cerrar al hacer click en el overlay (fuera de la tabla)
  const overlay = document.getElementById('amulet-table-overlay');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      // Solo cerrar si el click es exactamente en el overlay, no en sus hijos
      if (e.target === overlay) {
        hideAmuletTable();
      }
    });
  }
  
  // Cerrar con la tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const overlay = document.getElementById('amulet-table-overlay');
      if (overlay && overlay.classList.contains('active')) {
        hideAmuletTable();
      }
    }
  });
  
  console.log('🎯 Todos los event listeners configurados');
}

/**
 * Muestra la tabla de amuletos con animación mejorada
 */
async function showAmuletTable() {
  try {
    console.log('🎮 Abriendo tabla de navegación...');
    
    // Cargar datos si no están disponibles
    if (amuletTableData.length === 0) {
      await loadAmuletTableData();
    }
    
    // Renderizar la tabla
    renderAmuletTable();
    
    // Mostrar overlay con animación suave
    const overlay = document.getElementById('amulet-table-overlay');
    if (overlay) {
      overlay.classList.add('active');
      // Bloquear scroll del body para mejor experiencia
      document.body.style.overflow = 'hidden';
      
      // Pequeño retraso para mejorar la animación
      setTimeout(() => {
        const firstSelected = overlay.querySelector('.amulet-item.selected');
        if (firstSelected) {
          firstSelected.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
    
    console.log('✅ Tabla de navegación abierta');
  } catch (error) {
    console.error('❌ Error al mostrar la tabla de amuletos:', error);
  }
}

/**
 * Oculta la tabla de amuletos con animación
 */
function hideAmuletTable() {
  console.log('🎮 Cerrando tabla de navegación...');
  
  const overlay = document.getElementById('amulet-table-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    // Restaurar scroll del body
    document.body.style.overflow = '';
    
    console.log('✅ Tabla de navegación cerrada');
  }
}

/**
 * Carga los datos de los amuletos para la tabla
 */
async function loadAmuletTableData() {
  try {
    console.log('📥 Cargando datos de amuletos...');
    
    // Si ya tenemos los datos globales de amuletos, usarlos
    if (typeof amuletos !== 'undefined' && amuletos.length > 0) {
      amuletTableData = [...amuletos];
      console.log(`✅ Datos cargados desde variable global: ${amuletTableData.length} amuletos`);
      return;
    }
    
    // Si no, intentar cargar desde el archivo JSON
    const possiblePaths = [
      'data/amuletos.json',
      '../data/amuletos.json',
      './amuletos.json',
      'amuletos.json'
    ];
    
    for (const path of possiblePaths) {
      try {
        console.log(`🔍 Intentando cargar desde: ${path}`);
        const response = await fetch(path);
        if (response.ok) {
          amuletTableData = await response.json();
          console.log(`✅ Datos cargados desde ${path}: ${amuletTableData.length} amuletos`);
          return;
        }
      } catch (e) {
        console.log(`⚠️ No se pudo cargar desde ${path}`);
      }
    }
    
    throw new Error('No se pudo cargar datos desde ninguna fuente');
    
  } catch (error) {
    console.error('❌ Error al cargar datos de amuletos:', error);
    // Datos de ejemplo como fallback
    amuletTableData = [
      {
        nombre: 'Amuleto de Ejemplo',
        imagen: 'images/amulets/ejemplo.png'
      }
    ];
    console.log('⚠️ Usando datos de ejemplo como fallback');
  }
}

/**
 * Renderiza la tabla de amuletos con estilo mejorado
 */
function renderAmuletTable() {
  const tableGrid = document.getElementById('amulet-table-grid');
  if (!tableGrid || amuletTableData.length === 0) {
    console.warn('⚠️ No se puede renderizar: tabla o datos no disponibles');
    return;
  }
  
  console.log(`🎨 Renderizando tabla con ${amuletTableData.length} amuletos...`);
  
  // Limpiar tabla existente
  tableGrid.innerHTML = '';
  
  // Obtener índice actual
  if (typeof indexActual !== 'undefined') {
    currentSelectedIndex = indexActual;
  }
  
  // Crear items de la tabla con animación escalonada
  amuletTableData.forEach((amuleto, index) => {
    const item = document.createElement('div');
    item.className = 'amulet-item';
    if (index === currentSelectedIndex) {
      item.classList.add('selected');
    }
    
    // Imagen por defecto mejorada
    const imagePath = amuleto.imagen || 'images/placeholder.png';
    
    item.innerHTML = `
      <img src="${imagePath}" 
           alt="${amuleto.nombre}" 
           class="amulet-item-image"
           onerror="this.src='images/placeholder.png'; this.onerror=null;"
           loading="lazy">
      <p class="amulet-item-name">${amuleto.nombre}</p>
    `;
    
    // CORRECCIÓN: Event listener mejorado para navegación
    item.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Verificar que no estamos clickeando el botón de cerrar
      const closeButton = document.getElementById('amulet-table-close');
      if (closeButton && (e.target === closeButton || closeButton.contains(e.target))) {
        return; // No navegar si se clickeó el botón de cerrar
      }
      
      navigateToAmulet(index);
    });
    
    // Animación de entrada escalonada
    item.style.animationDelay = `${index * 20}ms`;
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    
    tableGrid.appendChild(item);
    
    // Animar entrada
    setTimeout(() => {
      item.style.transition = 'all 0.3s ease';
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    }, index * 20);
  });
  
  console.log('✅ Tabla renderizada exitosamente');
}

/**
 * Precarga imágenes adyacentes en la tabla de navegación
 */
function precargarImagenTabla(index) {
  [index - 1, index + 1].forEach(i => {
    if (amuletTableData[i] && amuletTableData[i].imagen) {
      const img = new Image();
      img.src = amuletTableData[i].imagen;
    }
  });
}

/**
 * Navega a un amuleto específico with feedback mejorado - VERSIÓN SIMPLIFICADA
 */
async function navigateToAmulet(index) {
  try {
    console.log(`🎯 Navegando al amuleto ${index + 1}/${amuletTableData.length}: ${amuletTableData[index]?.nombre}`);
    
    // Actualizar índice global si existe
    if (typeof indexActual !== 'undefined') {
      indexActual = index;
    }
    
    // Variable para controlar si la navegación fue exitosa
    let navigationSuccess = false;
    
    // Mostrar el amuleto si la función existe
    if (typeof mostrarAmuleto === 'function') {
      await mostrarAmuleto(index);
      navigationSuccess = true;
    } else if (typeof window.mostrarAmuleto === 'function') {
      await window.mostrarAmuleto(index);
      navigationSuccess = true;
    } else {
      console.warn('⚠️ Función mostrarAmuleto no encontrada');
      hideAmuletTable();
      return;
    }
    
    // Solo cerrar la tabla si la navegación fue exitosa
    if (navigationSuccess) {
      hideAmuletTable();
      
      // Precarga imágenes adyacentes para navegación fluida
      precargarImagenTabla(index);

      // Scroll suave hacia arriba después de cerrar
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }, 300);
      
      console.log('✅ Navegación completada');
    }
    
  } catch (error) {
    console.error('❌ Error al navegar al amuleto:', error);
    hideAmuletTable();
  }
}

/**
 * Actualiza la tabla cuando cambia el amuleto actual
 */
function updateTableSelection(newIndex) {
  currentSelectedIndex = newIndex;
  console.log(`🔄 Actualizando selección a índice: ${newIndex}`);
  
  // Actualizar selección visual si la tabla está visible
  const overlay = document.getElementById('amulet-table-overlay');
  if (overlay && overlay.classList.contains('active')) {
    const items = document.querySelectorAll('.amulet-item');
    items.forEach((item, index) => {
      if (index === newIndex) {
        item.classList.add('selected');
        // Scroll suave al elemento seleccionado
        item.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        item.classList.remove('selected');
      }
    });
  }
}

// ================================
// INICIALIZACIÓN
// ================================

/**
 * Inicializa la tabla cuando el DOM esté listo
 */
function initTableWhenReady() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAmuletTable);
  } else {
    // DOM ya está listo
    setTimeout(initAmuletTable, 500); // Pequeño delay para asegurar que otros scripts estén listos
  }
}

// ================================
// INTEGRACIÓN CON NAVEGACIÓN EXISTENTE
// ================================

/**
 * Hook para integrar con la navegación existente
 */
function hookIntoExistingNavigation() {
  // Sobrescribir las funciones de navegación existentes para actualizar la tabla
  if (typeof navegarAnterior === 'function') {
    const originalAnterior = navegarAnterior;
    window.navegarAnterior = async function() {
      await originalAnterior();
      if (typeof indexActual !== 'undefined') {
        updateTableSelection(indexActual);
      }
    };
  }
  
  if (typeof navegarSiguiente === 'function') {
    const originalSiguiente = navegarSiguiente;
    window.navegarSiguiente = async function() {
      await originalSiguiente();
      if (typeof indexActual !== 'undefined') {
        updateTableSelection(indexActual);
      }
    };
  }
  
  console.log('🔗 Integración con navegación existente completada');
}

// ================================
// FUNCIONES PÚBLICAS
// ================================

// Exponer funciones necesarias globalmente
window.amuletTableNavigation = {
  show: showAmuletTable,
  hide: hideAmuletTable,
  updateSelection: updateTableSelection,
  navigateTo: navigateToAmulet,
  init: initAmuletTable
};

// ================================
// INICIALIZACIÓN AUTOMÁTICA
// ================================

// Inicializar cuando esté listo
initTableWhenReady();

// Hook en la navegación existente después de un breve delay
setTimeout(() => {
  hookIntoExistingNavigation();
}, 1000);

console.log('🚀 Sistema de tabla de navegación de amuletos cargado');