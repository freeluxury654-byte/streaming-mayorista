fetch("data.json")
  .then(res => res.json())
  .then(data => renderCatalogo(data));

function renderCatalogo(data) {
  const cont = document.getElementById("catalogo");
  cont.innerHTML = "";

  data.categorias.forEach(cat => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `<h3>${cat.nombre}</h3>`;

    cat.productos.forEach(p => {
      const div = document.createElement("div");
      div.className = "product";

      const msg = encodeURIComponent(
        `Hola, quiero pedir:\nProducto: ${p.nombre}\nPrecio: ${p.precio}\nCantidad: 1`
      );

      div.innerHTML = `
        <div><strong>${p.nombre}</strong></div>
        <div class="price">${p.precio}</div>
        <div class="stock">📦 Stock: ${p.stock}</div>
        <span class="tag">${p.garantia ? "Con garantía" : "Sin garantía"}</span>
        <a class="whatsapp" href="https://wa.me/12494792518?text=${msg}" target="_blank">💬</a>
      `;

      card.appendChild(div);
    });

    cont.appendChild(card);
  });
}
