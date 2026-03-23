let catalogoData = null;
let modoAdmin = false;

document.addEventListener("DOMContentLoaded", () => {
  cargarCatalogo();
  prepararBotonAdmin();
});

/* Cargar */
async function cargarCatalogo() {
  const res = await fetch(`data.json?v=${Date.now()}`);
  catalogoData = await res.json();
  renderCatalogo();
}

/* Render con menú */
function renderCatalogo() {
  const contenedor = document.getElementById("catalogo");
  contenedor.innerHTML = "";

  const menu = document.createElement("div");
  menu.className = "menu-categorias";

  const contenido = document.createElement("div");
  contenido.id = "contenido";

  catalogoData.categorias.forEach((cat, i) => {
    const btn = document.createElement("button");
    btn.textContent = cat.nombre;

    btn.onclick = () => {
      mostrarCategoria(i);
      document.querySelectorAll(".menu-categorias button")
        .forEach(b=>b.classList.remove("activo"));
      btn.classList.add("activo");
    };

    menu.appendChild(btn);
  });

  contenedor.appendChild(menu);
  contenedor.appendChild(contenido);

  mostrarCategoria(0);
}

/* Mostrar categoría */
function mostrarCategoria(i) {
  const cat = catalogoData.categorias[i];
  const contenido = document.getElementById("contenido");

  contenido.innerHTML = `
    <h2>${cat.nombre}</h2>
    <div class="productos-grid"></div>
  `;

  const grid = contenido.querySelector(".productos-grid");

  cat.productos.forEach(p => {
    const stock = p.stock || 0;

    let msg = stock <= 3
      ? `🔥 Quedan ${stock}`
      : `📦 Stock`;

    const card = document.createElement("div");
    card.className = "producto-card";

    card.innerHTML = `
      <h3>${p.nombre}</h3>
      <p>${p.descripcion || ""}</p>
      <p>💰 $${p.precio}</p>
      <p>${msg}</p>
      <a class="btn-whatsapp"
        href="https://wa.me/12494792518?text=Quiero ${p.nombre}"
        target="_blank">
        Comprar
      </a>
    `;

    grid.appendChild(card);
  });
}

/* ADMIN */
function prepararBotonAdmin() {
  const btn = document.getElementById("btnEditor");

  btn.onclick = () => {
    const clave = prompt("Clave admin:");
    if (clave === "7777") {
      alert("Modo admin activo (edita JSON manualmente)");
    } else {
      alert("Incorrecto");
    }
  };
}
