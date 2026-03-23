let data=null;
let admin=false;

const iconos={
  "STREAMING":"🎬",
  "VPN":"🌐",
  "INTELIGENCIA ARTIFICIAL":"🤖",
  "Herramientas":"🛠️"
};

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

/* RENDER */
function render(){
  const c=document.getElementById("catalogo");
  c.innerHTML="";

  const top=document.createElement("div");

  if(admin){
    const guardar=document.createElement("button");
    guardar.textContent="💾 Guardar";
    guardar.onclick=()=>localStorage.setItem("catalogo",JSON.stringify(data));

    const exportar=document.createElement("button");
    exportar.textContent="📤 Exportar JSON";
    exportar.onclick=exportarJSON;

    const addCat=document.createElement("button");
    addCat.textContent="📂 Nueva categoría";
    addCat.onclick=()=>{
      data.categorias.push({nombre:"Nueva",productos:[]});
      render();
    };

    top.append(guardar,exportar,addCat);
  }

  c.appendChild(top);

  const menu=document.createElement("div");
  menu.className="menu-categorias";

  const content=document.createElement("div");

  data.categorias.forEach((cat,i)=>{
    const btn=document.createElement("button");
    btn.textContent=`${iconos[cat.nombre]||"📦"} ${cat.nombre}`;

    btn.onclick=()=>{
      mostrar(i);
      document.querySelectorAll(".menu-categorias button").forEach(b=>b.classList.remove("activo"));
      btn.classList.add("activo");
    };

    menu.appendChild(btn);
  });

  c.append(menu,content);
  mostrar(0);
}

/* MOSTRAR */
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
      <p>${admin?`<input type="number" value="${p.stock||0}" onchange="data.categorias[${i}].productos[${pi}].stock=Number(this.value)">`:stockTxt}</p>

      <p style="font-size:12px;color:#00ffcc;">⚡ Activación inmediata</p>
      <p style="font-size:12px;color:#ffcc00;">🔥 Alta demanda</p>

      ${
        admin
        ? `<button onclick="eliminarProd(${i},${pi})">❌</button>`
        : `<a class="btn-whatsapp" href="https://wa.me/12494792518?text=Quiero ${p.nombre}">💸 Obtener acceso</a>`
      }
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

/* ADMIN */
function setupAdmin(){
  document.getElementById("btnAdmin").onclick=()=>{
    if(prompt("Clave admin:")==="7777"){
      admin=true;
      render();
    }
  };
}

/* FUNCIONES */
function eliminarProd(i,pi){
  data.categorias[i].productos.splice(pi,1);
  render();
}

function exportarJSON(){
  const blob=new Blob([JSON.stringify(data,null,2)]);
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download="data.json";
  a.click();
}
