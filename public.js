/* =====================================================
   Streaming Pro Center – public.js FINAL PRO
   Editor completo + Export JSON + Cache Busting
   Clave admin: 7777
===================================================== */

let catalogoData = null;
let modoAdmin = false;

document.addEventListener("DOMContentLoaded", () => {
  cargarCatalogo();
  prepararBotonAdmin();
});

/* ===============================
   CARGAR CATÁLOGO (SIN CACHÉ)
================================ */
async function cargarCatalogo() {
  const contenedor = document.getElementById("catalogo");
  if (!contenedor) return;

  try {
    // 🔥 Cache busting definitivo
    const res = await fetch(`data.json?v=${Date.now()}`);
    if (!res.ok) throw new Error("No se pudo cargar data.json");

    catalogoData = await res.json();
    renderCatalogo();

  } catch (error) {
    contenedor.innerHTML = `
      <div class="error">
        ❌ Error cargando catálogo.<br>
        Verifica <b>data.json</b>
      </div>
    `;
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

  if (modoAdmin) {
    const acciones = document.createElement("div");
    acciones.style.marginTop = "40px";
    acciones.style.display = "flex";
    acciones.style.gap = "12px";
    acciones.style.flexWrap = "wrap";

    acciones.appendChild(crearBotonAgregarCategoria());
    acciones.appendChild(crearBotonRecargar());
    acciones.appendChild(crearBotonExportar());

    contenedor.appendChild(acciones);
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

    ${modoAdmin ? `
      <div style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap">
        <button onclick="agregarProducto(${iCat})">➕ Agregar producto</button>
        <button onclick="eliminarCategoria(${iCat})">❌ Eliminar categoría</button>
      </div>
    ` : ""}
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
        📦
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

    ${modoAdmin
      ? `<button onclick="eliminarProducto(${iCat},${iProd})">❌ Eliminar producto</button>`
      : `<a class="btn-whatsapp"
           href="https://wa.me/12494792518?text=${encodeURIComponent(`Hola 👋 Me interesa ${producto.nombre}`)}"
           target="_blank">
           💬 Pedir por WhatsApp
         </a>`}
  `;

  return card;
}

/* ===============================
   ACCIONES ADMIN
================================ */
function agregarCategoria() {
  catalogoData.categorias.push({
    nombre: "Nueva categoría",
    descripcion: "",
    productos: []
  });
  renderCatalogo();
}

function eliminarCategoria(iCat) {
  if (confirm("¿Eliminar esta categoría?")) {
    catalogoData.categorias.splice(iCat, 1);
    renderCatalogo();
  }
}

function agregarProducto(iCat) {
  catalogoData.categorias[iCat].productos.push({
    nombre: "Nuevo producto",
    descripcion: "",
    precio: "",
    stock: 0,
    garantia: false,
    etiquetas: []
  });
  renderCatalogo();
}

function eliminarProducto(iCat, iProd) {
  if (confirm("¿Eliminar este producto?")) {
    catalogoData.categorias[iCat].productos.splice(iProd, 1);
    renderCatalogo();
  }
}

/* ===============================
   BOTONES
================================ */
function crearBotonAgregarCategoria() {
  const btn = document.createElement("button");
  btn.textContent = "➕ Agregar categoría";
  btn.onclick = agregarCategoria;
  return btn;
}

function crearBotonRecargar() {
  const btn = document.createElement("button");
  btn.textContent = "🔄 Recargar catálogo";
  btn.onclick = () => {
    cargarCatalogo();
    alert("✅ Catálogo actualizado");
  };
  return btn;
}

function crearBotonExportar() {
  const btn = document.createElement("button");
  btn.textContent = "📤 Exportar data.json";
  btn.onclick = () => {
    const blob = new Blob(
      [JSON.stringify(catalogoData, null, 2)],
      { type: "application/json" }
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "data.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };
  return btn;
}

/* ===============================
   ADMIN LOGIN
================================ */
function prepararBotonAdmin() {
  const btn = document.getElementById("btnEditor");
  if (!btn) return;

  btn.onclick = () => {
    const clave = prompt("🔐 Ingresa la clave de administrador:");
    if (clave === "7777") {
      modoAdmin = true;
      document.body.classList.add("modo-admin");
      renderCatalogo();
      alert("✅ Modo administrador activado");
    } else {
      alert("❌ Clave incorrecta");
    }
  };
}
