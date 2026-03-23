let data=null;
let admin=false;

document.addEventListener("DOMContentLoaded",init);

async function init(){
  const local=localStorage.getItem("catalogo");
  if(local){
    data=JSON.parse(local);
  }else{
    const res=await fetch("data.json");
    data=await res.json();
  }

  render();
  setupAdmin();
}

/* ================= MENU ================= */

function render(){
  const c=document.getElementById("catalogo");
  c.innerHTML="";

  const menu=document.createElement("div");
  menu.className="menu-categorias";

  const content=document.createElement("div");

  data.categorias.forEach((cat,i)=>{
    const btn=document.createElement("button");
    btn.textContent=cat.nombre;

    btn.onclick=()=>{
      mostrar(i);
      document.querySelectorAll(".menu-categorias button").forEach(b=>b.classList.remove("activo"));
      btn.classList.add("activo");
    };

    menu.appendChild(btn);
  });

  c.appendChild(menu);
  c.appendChild(content);

  mostrar(0);
}

/* ================= MOSTRAR ================= */

function mostrar(i){
  const cat=data.categorias[i];
  const content=document.querySelector("#catalogo div:last-child");

  content.innerHTML=`<h2>${cat.nombre}</h2><div class="productos-grid"></div>`;

  const grid=content.querySelector(".productos-grid");

  cat.productos.forEach((p,pi)=>{
    const stock=p.stock||0;

    let stockTxt=
      stock===0?"❌ Agotado":
      stock<=3?`🔥 Últimas ${stock}`:
      stock<=10?`⚡ ${stock} disponibles`:
      `📦 ${stock} disponibles`;

    const card=document.createElement("div");
    card.className="producto-card";

    card.innerHTML=`
      <h3>${admin?`<input value="${p.nombre}" onchange="data.categorias[${i}].productos[${pi}].nombre=this.value">`:p.nombre}</h3>

      <p>${admin?`<input value="${p.descripcion||""}" onchange="data.categorias[${i}].productos[${pi}].descripcion=this.value">`:p.descripcion||"Cuenta premium ⚡"}</p>

      <p>💰 ${admin?`<input value="${p.precio}" onchange="data.categorias[${i}].productos[${pi}].precio=this.value">`:p.precio}</p>

      <p>${stockTxt}</p>

      ${admin?
      `<button onclick="eliminarProd(${i},${pi})">❌</button>`
      :
      `<a class="btn-whatsapp" href="https://wa.me/12494792518?text=Quiero ${p.nombre}">💸 Comprar ahora</a>`}
    `;

    grid.appendChild(card);
  });

  if(admin){
    const add=document.createElement("button");
    add.textContent="➕ Agregar producto";
    add.onclick=()=>{
      data.categorias[i].productos.push({nombre:"Nuevo",precio:"",stock:1});
      render();
    };

    content.appendChild(add);
  }
}

/* ================= ADMIN ================= */

function setupAdmin(){
  document.getElementById("btnAdmin").onclick=()=>{
    const clave=prompt("Clave:");
    if(clave==="7777"){
      admin=true;
      alert("Modo admin activado");
      render();
    }
  };
}

/* ================= ACCIONES ================= */

function eliminarProd(i,pi){
  data.categorias[i].productos.splice(pi,1);
  render();
}

/* ================= GUARDAR ================= */

function guardar(){
  localStorage.setItem("catalogo",JSON.stringify(data));
  alert("Guardado local");
}

/* ================= EXPORT ================= */

function exportar(){
  const blob=new Blob([JSON.stringify(data,null,2)]);
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download="data.json";
  a.click();
}
