let DATA = null;
let isAdmin = false;
const PASS = "1234"; // 🔐 cambia esta clave si quieres

/* ================== CARGA ================== */
fetch("data.json")
  .then(r => r.json())
  .then(d => {
    DATA = d;
    render();
  });

/* ================== RENDER ================== */
function render() {
  const cont = document.getElementById("catalogo");
  cont.innerHTML = "";

  const today = new Date().toISOString().split("T")[0];

  DATA.categorias
    .filter(c => c.activo)
    .sort((a, b) => a.orden - b.orden)
    .forEach(cat => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <h3>${cat.nombre}</h3>
        <p class="cat-desc">${cat.descripcion}</p>
      `;

      cat.productos
        .filter(p => p.activo)
        .forEach(p => {
          let tags = "";

          // 🔥 oferta automática por fecha
          if (
            p.oferta &&
            p.oferta.activa &&
            today >= p.oferta.desde &&
            today <= p.oferta.hasta
          ) {
            tags += `<span class="tag badge-offer">${p.oferta.texto}</span>`;
          }

          // etiquetas manuales
          if (p.etiquetas) {
            p.etiquetas.forEach(t => {
              tags += `<span class="tag">${t}</span>`;
            });
          }

          // ⚠️ alerta de bajo stock
          let stockText = `📦 Stock: ${p.stock}`;
          if (p.stock <= p.alerta_stock) {
            stockText = `⚠️ Últimas unidades (${p.stock})`;
          }

          const prod = document.createElement("div");
          prod.className = "product";
          prod.onclick = () => trackClick(p.id);

          prod.innerHTML = `
            <strong>${p.nombre}</strong>
            <div class="cat-desc">${p.descripcion}</div>
            <div class="price">$${p.precio_unitario} USD</div>
            <div class="stock">${stockText}</div>
            <div>${p.garantia ? "🛡️ Con garantía" : "⚠️ Sin garantía"}</div>
            ${tags}
          `;

          card.appendChild(prod);
        });

      cont.appendChild(card);
    });

  if (isAdmin) renderStats();
}

/* ================== MÉTRICAS ================== */
function trackClick(id) {
  const stats = JSON.parse(localStorage.getItem("STATS")) || {};
  stats[id] = (stats[id] || 0) + 1;
  localStorage.setItem("STATS", JSON.stringify(stats));
}

function renderStats() {
  const stats = JSON.parse(localStorage.getItem("STATS")) || {};
  const cont = document.getElementById("catalogo");

  const panel = document.createElement("div");
  panel.className = "card";

  let html = "<h3>📊 Métricas de clic</h3>";
  Object.keys(stats).forEach(k => {
    html += `<p>${k}: <strong>${stats[k]}</strong></p>`;
  });

  panel.innerHTML = html;
  cont.prepend(panel);
}

/* ================== ADMIN ================== */
function enterAdmin() {
  const p = prompt("Clave de edición:");
  if (p === PASS) {
    isAdmin = true;
    render();
  } else {
    alert("Clave incorrecta");
  }
}
