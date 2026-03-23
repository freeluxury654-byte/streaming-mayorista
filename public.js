let data = null;
let admin = false;

document.addEventListener("DOMContentLoaded", init);

async function init() {
  const local = localStorage.getItem("catalogo");

  if (local) {
    data = JSON.parse(local);
  } else {
    const res = await fetch("data.json");
    data = await res.json();
  }

  render();
  setupAdmin();
}

/* ================= RENDER ================= */

function render() {
  const c = document.getElementById("catalogo");
  c.innerHTML = "";

  // 🔥 TOP BAR ADMIN (SIEMPRE VISIBLE EN ADMIN)
  const topBar = document.createElement("div");
  topBar.style.display = "flex";
  topBar.style.gap = "10px";
  topBar.style.marginBottom = "15px";
  topBar.style.flexWrap = "wrap";

  if (admin) {
    const guardar = document.createElement("button");
    guardar.textContent = "💾 Guardar";
    guardar.onclick = () => {
      localStorage.setItem("catalogo", JSON.stringify(data));
      alert("Guardado local");
    };

    const exportar = document.createElement("button");
    exportar.textContent = "📤 Exportar JSON";
    exportar.onclick = exportarJSON;

    const addCat = document.createElement("button");
    addCat.textContent = "📂 Nueva categoría";
    addCat.onclick = () => {
      data.categorias.push({
        nombre: "Nueva categoría",
        productos: []
      });
      render();
    };

    topBar.appendChild(guardar);
    topBar.appendChild(exportar);
    topBar.appendChild(addCat);
  }

  c.appendChild(topBar);

  // 🔥 MENU DE CATEGORIAS
  const menu = document.createElement("div");
  menu.className = "menu-categorias";

  const content = document.createElement("div");

  data.categorias.forEach((cat, i) => {
    const btn = document.createElement("button");
    btn.textContent = cat.nombre;

    btn.onclick = () => {
      mostrar(i);

      document.querySelectorAll(".menu-categorias button")
        .forEach(b => b.classList.remove("activo"));

      btn.classList.add("activo");
    };

    menu.appendChild(btn);
  });

  c.appendChild(menu);
  c.appendChild(content);

  mostrar(0);
}

/* ================= MOSTRAR ================= */

function mostrar(i) {
  const cat = data.categorias[i];
  const content = document.querySelector("#catalogo div:last-child");

  content.innerHTML = `
    <h2>${cat.nombre}</h2>
    <div class="productos-grid"></div>
  `;

  const grid = content.querySelector(".productos-grid");

  cat.productos.forEach((p, pi) => {

    const stock = p.stock || 0;

    let stockTxt =
      stock === 0 ? "❌ Agotado" :
      stock <= 3 ? `🔥 Últimas ${stock}` :
      stock <= 10 ? `⚡ ${stock} disponibles` :
      `📦 ${stock} disponibles`;

    const card = document.createElement("div");
    card.className = "producto-card";

    card.innerHTML = `
      <h3>
        ${admin
          ? `<input value="${p.nombre}" onchange="data.categorias[${i}].productos[${pi}].nombre=this.value">`
          : p.nombre}
      </h3>

      <p>
        ${admin
          ? `<input value="${p.descripcion || ""}" onchange="data.categorias[${i}].productos[${pi}].descripcion=this.value">`
          : (p.descripcion || "Cuenta premium ⚡")}
      </p>

      <p>
        💰 ${admin
          ? `<input value="${p.precio}" onchange="data.categorias[${i}].productos[${pi}].precio=this.value">`
          : p.precio}
      </p>

      <p>
        ${admin
          ? `<input type="number" value="${p.stock || 0}" onchange="data.categorias[${i}].productos[${pi}].stock=Number(this.value)">`
          : stockTxt}
      </p>

      ${
        admin
          ? `<button onclick="eliminarProd(${i},${pi})">❌ Eliminar</button>`
          : `<a class="btn-whatsapp"
               href="https://wa.me/12494792518?text=Quiero ${p.nombre}"
               target="_blank">
               💸 Comprar ahora
             </a>`
      }
    `;

    grid.appendChild(card);
  });

  // 🔥 BOTÓN AGREGAR PRODUCTO
  if (admin) {
    const add = document.createElement("button");
    add.textContent = "➕ Agregar producto";
    add.style.marginTop = "15px";

    add.onclick = () => {
      data.categorias[i].productos.push({
        nombre: "Nuevo producto",
        descripcion: "",
        precio: "",
        stock: 1
      });
      render();
    };

    content.appendChild(add);
  }
}

/* ================= ADMIN ================= */

function setupAdmin() {
  document.getElementById("btnAdmin").onclick = () => {
    const clave = prompt("Clave admin:");

    if (clave === "7777") {
      admin = true;
      alert("Modo admin activado");
      render();
    } else {
      alert("Clave incorrecta");
    }
  };
}

/* ================= FUNCIONES ================= */

function eliminarProd(i, pi) {
  data.categorias[i].productos.splice(pi, 1);
  render();
}

function exportarJSON() {
  const dataStr = JSON.stringify(data, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "data.json";
  a.click();
}
