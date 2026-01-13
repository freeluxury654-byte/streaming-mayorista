let DATA = null;
let isAdmin = false;
const PASS = "7777"; // 🔐 CAMBIA ESTA CLAVE

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
              onchange="editCategory(${ci}, this.value)">`
          : cat.nombre}
      </h3>

      ${isAdmin ? `
        <div class="admin-actions">
          <button onclick="addProduct(${ci})">➕ Producto</button>
          <button onclick="removeCategory(${ci})">🗑 Categoría</button>
        </div>
      ` : ""}
    `;

    cat.productos.forEach((p, pi) => {
      card.innerHTML += `
        <div class="product">
          ${isAdmin ? `
            <input class="admin-input" value="${p.nombre}"
              onchange="editProduct(${ci},${pi},'nombre',this.value)">
            <input class="admin-input" value="${p.precio}"
              onchange="editProduct(${ci},${pi},'precio',this.value)">
            <input class="admin-input" type="number" value="${p.stock}"
              onchange="editProduct(${ci},${pi},'stock',this.value)">
            <select class="toggle"
              onchange="editProduct(${ci},${pi},'garantia',this.value)">
              <option value="true" ${p.garantia ? "selected" : ""}>Con garantía</option>
              <option value="false" ${!p.garantia ? "selected" : ""}>Sin garantía</option>
            </select>

            <div class="admin-actions">
              <button onclick="removeProduct(${ci},${pi})">🗑 Producto</button>
            </div>
          ` : `
            <strong>${p.nombre}</strong>
            <div class="price">${p.precio}</div>
            <div class="stock">📦 Stock: ${p.stock}</div>
            <span class="tag">${p.garantia ? "Con garantía" : "Sin garantía"}</span>
          `}
        </div>
      `;
    });

    cont.appendChild(card);
  });

  localStorage.setItem("DATA_LOCAL", JSON.stringify(DATA));
}

/* ===== ACCIONES EDITOR ===== */

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

function editCategory(ci, value) {
  DATA.categorias[ci].nombre = value;
}

function addProduct(ci) {
  DATA.categorias[ci].productos.push({
    nombre: "Nuevo producto",
    precio: "$0",
    stock: 0,
    garantia: true
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

