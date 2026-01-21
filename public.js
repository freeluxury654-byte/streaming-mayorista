/* =====================================================
   Streaming Pro Center – public.js PRO
   Modo admin + edición inline + export JSON
   Clave admin: 7777
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
    const res = await fetch("data.json");
    if (!res.ok) throw new Error("No se pudo cargar data.json");

    catalogoData = await res.json();
    renderCatalogo();

  } catch (err) {
    contenedor.innerHTML = `
      <div class="error">
        ❌ Error cargando catálogo.<br>
        Verifica <b>data.json</b>
      </div>`;
    console.error(err);
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

  if (modoAdmin) {
    contenedor.appendChild(crearBotonExportar());
  }
}

/* ===============================
   CATEGORÍA
================================ */
function crearCategoria(categoria, iCat) {
  const section = document.createElement("section");
  section.className = "categoria";

  section.innerHTML = `
    <h2 class="categoria-titulo">
      ${modoAdmin
        ? `<input value="${categoria.nombre}" 
            oninput="catalogoData.categorias[${iCat}].nombre=this.value">`
        : categoria.nombre}
    </h2>

    <p class="categoria-desc">
      ${modoAdmin
        ? `<textarea oninput="catalogoData.categorias[${iCat}].descripcion=this.value">${categoria.descripcion || ""}</textarea>`
        : (categoria.descripcion || "")}
    </p>

    <div class="productos-grid"></div>
  `;

  const grid = section.querySelector(".productos-grid");

  categoria.productos.forEach((producto, iProd) => {
    grid.appendChild(crearProducto(producto, iCat, iProd));
  });

  return section;
}

/* ===============================
   PRODUCTO
================================ */
function crearProducto(producto, iCat, iProd) {
  const card = document.createElement("div");
  card.className = "producto-card";

  const etiquetas = (producto.etiquetas || []).join(", ");

  card.innerHTML = `
    <h3 class="producto-nombre">
      ${modoAdmin
        ? `<input value="${producto.nombre}"
            oninput="catalogoData.categorias[${iCat}].productos[${iProd}].nombre=this.value">`
        : producto.nombre}
    </h3>

    <p class="producto-desc">
      ${modoAdmin
        ? `<textarea oninput="catalogoData.categorias[${iCat}].productos[${iProd}].descripcion=this.value">${producto.descripcion || ""}</textarea>`
        : (producto.descripcion || "")}
    </p>

    <div class="producto-info">
      <span class="precio">
        ${modoAdmin
          ? `<input value="${producto.precio}"
              oninput="catalogoData.categorias[${iCat}].productos[${iProd}].precio=this.value">`
          : producto.precio}
      </span>

      <span class="stock">
        📦 Stock:
        ${modoAdmin
          ? `<input type="number" min="0" value="${producto.stock}"
              oninput="catalogoData.categorias[${iCat}].productos[${iProd}].stock=Number(this.value)">`
          : producto.stock}
      </span>
    </div>

    <div class="producto-extra">
      ${modoAdmin
        ? `<select onchange="catalogoData.categorias[${iCat}].productos[${iProd}].garantia=this.value==='true'">
            <option value="true" ${producto.garantia ? "selected" : ""}>🛡️ Con garantía</option>
            <option value="false" ${!producto.garantia ? "selected" : ""}>🚫 Sin garantía</option>
          </select>`
        : producto.garantia
          ? `<span class="garantia">🛡️ Con garantía</span>`
          : `<span class="sin-garantia">🚫 Sin garantía</span>`}
    </div>

    <div class="producto-tags">
      ${modoAdmin
        ? `<input value="${etiquetas}"
            placeholder="Etiquetas separadas por coma"
            oninput="catalogoData.categorias[${iCat}].productos[${iProd}].etiquetas=this.value.split(',').map(t=>t.trim())">`
        : (producto.etiquetas || []).map(t => `<span class="tag">${t}</span>`).join("")}
    </div>

    <a class="btn-whatsapp"
       href="https://wa.me/12494792518?text=${encodeURIComponent(
         `Hola 👋 Me interesa: ${producto.nombre}`
       )}"
       target="_blank">
       💬 Pedir por WhatsApp
    </a>
  `;

  return card;
}

/* ===============================
   BOTÓN EXPORTAR JSON
================================ */
function crearBotonExportar() {
  const btn = document.createElement("button");
  btn.textContent = "📤 Exportar data.json";
  btn.style.marginTop = "40px";
  btn.style.padding = "14px 24px";
  btn.style.borderRadius = "999px";
  btn.style.border = "none";
  btn.style.background = "#0ea5e9";
  btn.style.color = "#fff";
  btn.style.fontWeight = "700";
  btn.style.cursor = "pointer";

  btn.onclick = () => {
    const blob = new Blob(
      [JSON.stringify(catalogoData, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return btn;
}

/* ===============================
   ADMIN
================================ */
function prepararBotonAdmin() {
  const btn = document.getElementById("btnEditor");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const clave = prompt("🔐 Ingresa la clave de administrador:");
    if (clave === "7777") {
      modoAdmin = true;
      document.body.classList.add("modo-admin");
      renderCatalogo();
      alert("✅ Modo administrador activado");
    } else {
      alert("❌ Clave incorrecta");
    }
  });
         }
