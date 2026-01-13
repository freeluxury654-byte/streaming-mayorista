fetch("data.json")
  .then(r=>r.json())
  .then(data=>{
    const cont = document.getElementById("catalogo");
    data.categorias.forEach(c=>{
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `<h2>${c.nombre}</h2>`;
      c.items.forEach(it=>{
        div.innerHTML += `
          <div class="item">
            <strong>${it.nombre}</strong><br>
            💵 $${it.precio_unitario} | Mayor (5+): $${it.precio_mayor}<br>
            📦 Stock: <span class="stock">${it.stock}</span><br>
            ${it.garantia ? "✔️ Con garantía" : "❌ Sin garantía"}
          </div>`;
      });
      cont.appendChild(div);
    });
  });
