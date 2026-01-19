let DATA = null;
let isAdmin = false;
const PASS = "1234"; // 🔐 CAMBIA ESTA CLAVE

fetch("data.json")
  .then(r => r.json())
  .then(d => {
    DATA = JSON.parse(localStorage.getItem("DATA_LOCAL")) || d;
    render();
  });

function render() {
  const cont = document.getElementById("catalogo");
  cont.innerHTML = "";

  document.getElementById("adminBar")
    .classList.toggle("hidden", !isAdmin);

  DATA.categorias.forEach((cat, ci) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>
        ${isAdmin
          ? `<input class="admin-input" value="${cat.nombre}"
              onchange="editCategory(${ci}, 'nombre', this.value)">`
          : cat.nombre}
      </h3>

      ${isAdmin
        ? `<input class="admin-input" placeholder="Descripción de la categoría"
             value="${cat.descripcion || ""}"
             onchange="editCategory(${ci}, 'descripcion', this.value)">`
        : cat.descripcion
          ? `<p class="cat-desc">${cat.descripcion}</p>`
          : ""
      }

      ${isAdmin ? `
        <div class="admin-actions">
          <button onclick="addProduct(${ci})">➕ Producto</button>
          <button onclick="removeCategory(${ci})">🗑 Categoría</button>
        </div>
      ` : ""}
    `;

    cat.productos.forEach((p, pi) => {
      let badge = "";
      if (p.etiqueta === "oferta") badge = `<span class="tag badge-offer">🔥 Oferta</span>`;
      if (p.etiqueta === "recomendado") badge = `<span class="tag badge-star">⭐ Recomendado</span>`;

      card.innerHTML += `
        <div class="product">
          ${isAdmin ? `
            <input class="admin-input" value="${p.nombre}"
              onchange="editProduct(${ci},${pi},'nombre',this.value)">
            <input class="admin-input" placeholder="Descripción del producto"
              value="${p.descripcion || ""}"
              onchange="editProduct(${ci},${pi},'descripcion',this.value)">
            <input class="admin-input" value="${p.precio}"
              onchange="editProduct(${ci},${pi},'precio',this.value)">
            <input class="admin-input" type="number" value="${p.stock}"
              onchange="editProduct(${ci},${pi},'stock',this.value)">

            <select class="admin-input"
              onchange="editProduct(${ci},${pi},'garantia',this.value)">
              <option value="true" ${p.garantia ? "selected" : ""}>Con garantía</option>
              <option value="false" ${!p.garantia ? "selected" : ""}>Sin garantía</option>
            </select>

            <select class="admin-input"
              onchange="editProduct(${ci},${pi},'etiqueta',this.value)">
              <option value="">Sin etiqueta</option>
              <option value="oferta" ${p.etiqueta==="oferta"?"selected":""}>🔥 Oferta</option>
              <option value="recomendado" ${p.etiqueta==="recomendado"?"selected":""}>⭐ Recomendado</option>
            </select>

            <div class="admin-actions">
              <button onclick="removeProduct(${ci},${pi})">🗑 Producto</button>
            </div>
          ` : `
            <strong>${p.nombre}</strong>
            ${p.descripcion ? `<div class="cat-desc">${p.descripcion}</div>` : ""}
            <div class="price">${p.precio}</div>
            <div class="stock">📦 Stock: ${p.stock}</div>
            <span class="tag">${p.garantia ? "Con garantía" : "Sin garantía"}</span>
            ${badge}
          `}
        </div>
      `;
    });

    cont.appendChild(card);
  });

  localStorage.setItem("DATA_LOCAL", JSON.stringify(DATA));
}

/* ===== EDITOR ===== */

function enterAdmin() {
  const p = prompt("Clave de edición:");
  if (p === PASS) {
    isAdmin = true;
    render();
  } else {
    alert("Clave incorrecta");
  }
}

function exitAdmin() {
  isAdmin = false;
  localStorage.removeItem("DATA_LOCAL");
  location.reload();
}

function addCategory() {
  DATA.categorias.push({
    nombre: "Nueva categoría",
    descripcion: "",
    productos: []
  });
  render();
}

function removeCategory(ci) {
  if (confirm("¿Eliminar esta categoría?")) {
    DATA.categorias.splice(ci, 1);
    render();
  }
}

function editCategory(ci, field, value) {
  DATA.categorias[ci][field] = value;
}

function addProduct(ci) {
  DATA.categorias[ci].productos.push({
    nombre: "Nuevo producto",
    descripcion: "",
    precio: "$0",
    stock: 0,
    garantia: true,
    etiqueta: ""
  });
  render();
}

function removeProduct(ci, pi) {
  if (confirm("¿Eliminar este producto?")) {
    DATA.categorias[ci].productos.splice(pi, 1);
    render();
  }
}

function editProduct(ci, pi, field, value) {
  if (field === "stock") value = Number(value);
  if (field === "garantia") value = value === "true";
  DATA.categorias[ci].productos[pi][field] = value;
}

function exportJSON() {
  const blob = new Blob(
    [JSON.stringify(DATA, null, 2)],
    { type: "application/json" }
  );
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "data.json";
  a.click();
}
