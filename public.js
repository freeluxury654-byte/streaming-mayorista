let DATA = null;
let isAdmin = false;
const PASS = "1234"; // cambia esta clave

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
      <h3>${isAdmin
        ? `<input class="admin-input" value="${cat.nombre}"
             onchange="editCategory(${ci}, this.value)">`
        : cat.nombre}
      </h3>
    `;

    cat.productos.forEach((p, pi) => {
      card.innerHTML += `
        <div class="product">
          ${isAdmin
            ? `
              <input class="admin-input" value="${p.nombre}"
                onchange="editProduct(${ci},${pi},'nombre',this.value)">
              <input class="admin-input" value="${p.precio}"
                onchange="editProduct(${ci},${pi},'precio',this.value)">
              <input class="admin-input" type="number" value="${p.stock}"
                onchange="editProduct(${ci},${pi},'stock',this.value)">
            `
            : `
              <strong>${p.nombre}</strong>
              <div class="price">${p.precio}</div>
              <div class="stock">📦 Stock: ${p.stock}</div>
            `
          }
        </div>
      `;
    });

    cont.appendChild(card);
  });

  localStorage.setItem("DATA_LOCAL", JSON.stringify(DATA));
}

function editCategory(ci, value) {
  DATA.categorias[ci].nombre = value;
}

function editProduct(ci, pi, field, value) {
  DATA.categorias[ci].productos[pi][field] =
    field === "stock" ? Number(value) : value;
}

document.getElementById("adminTrigger").onclick = (() => {
  let clicks = 0;
  return () => {
    clicks++;
    if (clicks === 5) {
      const p = prompt("Clave editor:");
      if (p === PASS) {
        isAdmin = true;
        alert("Modo edición activado");
        render();
      }
      clicks = 0;
    }
  };
})();

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

function exitAdmin() {
  isAdmin = false;
  localStorage.removeItem("DATA_LOCAL");
  location.reload();
}
