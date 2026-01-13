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
      let stockClass = "ok";
      let stockText = "🟢 Disponible";

      if (p.stock <= 5 && p.stock > 0) {
        stockClass = "low";
        stockText = "⚠️ Bajo stock";
      }

      if (p.stock === 0) {
        stockClass = "out";
        stockText = "🔴 Agotado";
      }

      const msg = encodeURIComponent(
        `Hola, quiero realizar un pedido:\n` +
        `Producto: ${p.nombre}\n` +
        `Precio: ${p.precio}\n` +
        `Cantidad: 1`
      );

      card.innerHTML += `
        <div class="product">
          <strong>${p.nombre}</strong>
          <div class="price">${p.precio}</div>
          <div class="stock ${stockClass}">
            📦 ${stockText} (${p.stock})
          </div>
          <span class="tag">${p.garantia ? "Con garantía" : "Sin garantía"}</span>
          <a class="whatsapp"
             href="https://wa.me/12494792518?text=${msg}"
             target="_blank">💬</a>
        </div>
      `;
    });

    cont.appendChild(card);
  });
}
