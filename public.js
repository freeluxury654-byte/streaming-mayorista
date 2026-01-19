let DATA;
let isAdmin = false;
const PASS = "1234";

/* ================= CARGA ================= */
fetch("data.json")
  .then(r => r.json())
  .then(d => {
    DATA = JSON.parse(localStorage.getItem("DATA_EDIT")) || d;
    render();
  });

/* ================= RENDER ================= */
function render() {
  const cont = document.getElementById("catalogo");
  cont.innerHTML = "";

  DATA.categorias
    .filter(c => c.activo)
    .sort((a,b) => a.orden - b.orden)
    .forEach((cat, ci) => {

      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `<h3>${cat.nombre}</h3><p class="cat-desc">${cat.descripcion}</p>`;

      cat.productos
        .filter(p => p.activo)
        .forEach((p, pi) => {

          let stockText = `📦 Stock: ${p.stock}`;
          if (p.stock <= p.alerta_stock) {
            stockText = `⚠️ Últimas unidades (${p.stock})`;
          }

          let tags = (p.etiquetas || []).map(t => `<span class="tag">${t}</span>`).join("");

          const prod = document.createElement("div");
          prod.className = "product";
          prod.onclick = () => trackClick(p.id);

          prod.innerHTML = isAdmin ? `
            <input value="${p.nombre}" onchange="edit(${ci},${pi},'nombre',this.value)">
            <input value="${p.descripcion}" onchange="edit(${ci},${pi},'descripcion',this.value)">
            <input type="number" value="${p.precio_unitario}" onchange="edit(${ci},${pi},'precio_unitario',this.value)">
            <input type="number" value="${p.precio_mayor}" onchange="edit(${ci},${pi},'precio_mayor',this.value)">
            <input type="number" value="${p.stock}" onchange="edit(${ci},${pi},'stock',this.value)">
            <label>
              <input type="checkbox" ${p.garantia ? "checked":""}
                onchange="edit(${ci},${pi},'garantia',this.checked)">
              Garantía
            </label>
            ${tags}
          ` : `
            <strong>${p.nombre}</strong>
            <div class="cat-desc">${p.descripcion}</div>
            <div class="price">$${p.precio_unitario} USD</div>
            <div>${stockText}</div>
            ${tags}
          `;

          card.appendChild(prod);
        });

      cont.appendChild(card);
    });

  localStorage.setItem("DATA_EDIT", JSON.stringify(DATA));
}

/* ================= EDIT ================= */
function edit(ci, pi, field, value) {
  if (field.includes("precio") || field === "stock") value = Number(value);
  DATA.categorias[ci].productos[pi][field] = value;
}

/* ================= EXPORT ================= */
function exportJSON() {
  const blob = new Blob([JSON.stringify(DATA, null, 2)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "data.json";
  a.click();
}

/* ================= ADMIN ================= */
function enterAdmin() {
  if (prompt("Clave de edición") === PASS) {
    isAdmin = true;
    render();
  }
}

/* ================= MÉTRICAS ================= */
function trackClick(id) {
  const s = JSON.parse(localStorage.getItem("STATS")) || {};
  s[id] = (s[id] || 0) + 1;
  localStorage.setItem("STATS", JSON.stringify(s));
}
