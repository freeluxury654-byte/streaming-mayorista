let data = null;
let editorActivo = false;

// ===== CARGA DATA =====
fetch("data.json")
  .then(res => res.json())
  .then(json => {
    data = json;
    renderCatalogo();
    verificarStockBajo();
  });

// ===== RENDER =====
function renderCatalogo() {
  const cont = document.getElementById("catalogo");
  cont.innerHTML = "";

  data.categorias.forEach(cat => {
    const box = document.createElement("div");
    box.className = "categoria";

    box.innerHTML = `
      <h3>${cat.nombre}</h3>
      <p class="desc-cat">${cat.descripcion}</p>
      <div class="productos"></div>
    `;

    const prodBox = box.querySelector(".productos");

    cat.productos.forEach(p => {
      prodBox.innerHTML += `
        <div class="producto">
          <h4>${p.nombre}</h4>
          <p class="desc">${p.descripcion}</p>

          <p class="precio">$${p.precio} USD</p>
          <p class="stock">📦 Stock: ${p.stock}</p>

          <div class="tags">
            ${p.garantia ? `<span class="tag ok">🛡️ Con garantía</span>` : `<span class="tag no">🚫 Sin garantía</span>`}
            ${p.tags.map(t => `<span class="tag">${t}</span>`).join("")}
          </div>

          <button class="wa" onclick="pedidoWhatsApp('${cat.nombre}','${p.nombre}','${p.precio}')">
            💬
          </button>
        </div>
      `;
    });

    cont.appendChild(box);
  });
}

// ===== WHATSAPP =====
function pedidoWhatsApp(cat, prod, precio) {
  registrarClick(prod);
  const msg = `
📦 Pedido mayorista
Categoría: ${cat}
Producto: ${prod}
Precio: $${precio} USD
Cantidad:
`;
  window.open(`https://wa.me/12494792518?text=${encodeURIComponent(msg)}`);
}

// ===== MÉTRICAS =====
function registrarClick(producto) {
  const clicks = JSON.parse(localStorage.getItem("clicks") || "{}");
  clicks[producto] = (clicks[producto] || 0) + 1;
  localStorage.setItem("clicks", JSON.stringify(clicks));
}

// ===== ALERTA STOCK =====
function verificarStockBajo() {
  data.categorias.forEach(c =>
    c.productos.forEach(p => {
      if (p.stock <= 3) {
        console.warn("⚠️ Bajo stock:", p.nombre);
      }
    })
  );
}

// ===== MODO EDITOR =====
document.getElementById("btnEditor").onclick = () => {
  const pass = prompt("Clave de administrador:");
  if (pass === "admin123") {
    alert("Editor activado. Puedes exportar el catálogo.");
    exportarJSON();
  }
};

function exportarJSON() {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "data.json";
  a.click();
}
