/* =====================================================
   🔥 Streaming Pro Center – VERSION PRO
   Animaciones + FOMO + Mejora de conversión
===================================================== */

let catalogoData = null;
let modoAdmin = false;

document.addEventListener("DOMContentLoaded", () => {
  cargarCatalogo();
  prepararBotonAdmin();
});

/* ===============================
   CARGAR CATÁLOGO
================================ */
async function cargarCatalogo() {
  const contenedor = document.getElementById("catalogo");
  if (!contenedor) return;

  try {
    const res = await fetch(`data.json?v=${Date.now()}`);
    catalogoData = await res.json();
    renderCatalogo();
  } catch (error) {
    contenedor.innerHTML = `❌ Error cargando catálogo`;
    console.error(error);
  }
}

/* ===============================
   RENDER GENERAL
================================ */
function renderCatalogo() {
  const contenedor = document.getElementById("catalogo");
  contenedor.innerHTML = "";

  catalogoData.categorias.forEach((categoria, iCat) => {
    contenedor.appendChild(crearCategoria(categoria, iCat));
  });
}

/* ===============================
   CATEGORÍA
================================ */
function crearCategoria(categoria, iCat) {
  const section = document.createElement("section");
  section.className = "categoria";

  section.innerHTML = `
    <h2 class="categoria-titulo">${categoria.nombre}</h2>
    <p class="categoria-desc">${categoria.descripcion || ""}</p>
    <div class="productos-grid"></div>
  `;

  const grid = section.querySelector(".productos-grid");

  categoria.productos.forEach((producto, iProd) => {
    grid.appendChild(crearProducto(producto));
  });

  return section;
}

/* ===============================
   PRODUCTO (MEJORADO)
================================ */
function crearProducto(producto) {
  const card = document.createElement("div");
  card.className = "producto-card";

  const stock = producto.stock ?? 0;

  // 🔥 Lógica FOMO
  let mensajeStock = "";
  if (stock <= 3) {
    mensajeStock = `🔥 Quedan solo ${stock} disponibles`;
  } else if (stock <= 10) {
    mensajeStock = `⚡ Alta demanda`;
  } else {
    mensajeStock = `📦 Stock disponible`;
  }

  card.innerHTML = `
    <h3 class="producto-nombre">🔥 ${producto.nombre}</h3>

    <p class="producto-desc">
      ${producto.descripcion || "Cuenta premium lista para usar"}
    </p>

    <div class="producto-info">
      <span class="precio">💰 $${producto.precio}</span>
      <span class="stock">${mensajeStock}</span>
    </div>

    <div class="producto-extra">
      ${
        producto.garantia
          ? `<span class="garantia">🛡️ Garantía incluida</span>`
          : `<span class="sin-garantia">🚫 Sin garantía</span>`
      }
    </div>

    <div class="producto-tags">
      ${(producto.etiquetas || [])
        .map(t => `<span class="tag">${t}</span>`)
        .join("")}
    </div>

    <a class="btn-whatsapp"
      href="https://wa.me/12494792518?text=${encodeURIComponent(
        `Hola 👋 Quiero comprar ${producto.nombre}`
      )}"
      target="_blank">
      💬 Comprar ahora
    </a>
  `;

  return card;
}

/* ===============================
   ADMIN (SE MANTIENE)
================================ */
function prepararBotonAdmin() {
  const btn = document.getElementById("btnEditor");
  if (!btn) return;

  btn.onclick = () => {
    const clave = prompt("🔐 Clave admin:");
    if (clave === "7777") {
      modoAdmin = true;
      alert("Modo admin activado");
    } else {
      alert("Clave incorrecta");
    }
  };
}
