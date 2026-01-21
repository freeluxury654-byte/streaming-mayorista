/* ===============================
   Streaming Pro Center
   public.js – Render de Catálogo
   =============================== */

document.addEventListener("DOMContentLoaded", () => {
  cargarCatalogo();
});

async function cargarCatalogo() {
  const contenedor = document.getElementById("catalogo");
  if (!contenedor) return;

  try {
    const response = await fetch("data.json");
    if (!response.ok) throw new Error("No se pudo cargar data.json");

    const data = await response.json();
    contenedor.innerHTML = "";

    data.categorias.forEach((categoria) => {
      contenedor.appendChild(crearCategoria(categoria));
    });

  } catch (error) {
    contenedor.innerHTML = `
      <div class="error">
        ❌ No se pudo cargar el catálogo.<br>
        Verifica <b>data.json</b>
      </div>
    `;
    console.error(error);
  }
}

/* ===============================
   Crear Categoría
   =============================== */
function crearCategoria(categoria) {
  const section = document.createElement("section");
  section.className = "categoria";

  section.innerHTML = `
    <h2 class="categoria-titulo">${categoria.nombre}</h2>
    <p class="categoria-desc">${categoria.descripcion || ""}</p>
    <div class="productos-grid"></div>
  `;

  const grid = section.querySelector(".productos-grid");

  categoria.productos.forEach((producto) => {
    grid.appendChild(crearProducto(producto));
  });

  return section;
}

/* ===============================
   Crear Producto (Card)
   =============================== */
function crearProducto(producto) {
  const card = document.createElement("div");
  card.className = "producto-card";

  const etiquetasHTML = (producto.etiquetas || [])
    .map(tag => `<span class="tag">${tag}</span>`)
    .join("");

  card.innerHTML = `
    <h3 class="producto-nombre">${producto.nombre}</h3>

    <p class="producto-desc">
      ${producto.descripcion || ""}
    </p>

    <div class="producto-info">
      <span class="precio">${producto.precio}</span>
      <span class="stock">📦 Stock: ${producto.stock}</span>
    </div>

    <div class="producto-extra">
      ${producto.garantia ? 
        `<span class="garantia">🛡️ Con garantía</span>` : 
        `<span class="sin-garantia">🚫 Sin garantía</span>`}
    </div>

    <div class="producto-tags">
      ${etiquetasHTML}
    </div>

    <a class="btn-whatsapp"
       href="https://wa.me/12494792518?text=${encodeURIComponent(
         `Hola, me interesa: ${producto.nombre}`
       )}"
       target="_blank">
       💬 Pedir por WhatsApp
    </a>
  `;

  return card;
}
