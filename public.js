const WHATSAPP = "12494792518";

fetch("data.json")
  .then(r => r.json())
  .then(data => {
    const cont = document.getElementById("catalogo");

    data.categorias.forEach(cat => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `<h2>${cat.nombre}</h2>`;

      cat.items.forEach(it => {
        const msg = encodeURIComponent(
          `Hola, quiero comprar:\n` +
          `Producto: ${it.nombre}\n` +
          `Cantidad: 1\n` +
          `Precio unitario: $${it.precio_unitario}\n` +
          `Precio mayor (5+): $${it.precio_mayor}`
        );

        card.innerHTML += `
          <div class="item ${it.oferta ? "oferta" : ""}">
            <strong>${it.nombre}</strong><br>
            💵 $${it.precio_unitario} | Mayor (5+): $${it.precio_mayor}<br>
            📦 Stock: ${it.stock}<br>
            ${it.garantia ? "🛡️ Con garantía" : "❌ Sin garantía"}
            ${it.oferta ? "<span class='badge'>🔥 OFERTA</span>" : ""}
            <br>
            <a class="btn" target="_blank"
               href="https://wa.me/${WHATSAPP}?text=${msg}">
               📲 Pedir por WhatsApp
            </a>
          </div>
        `;
      });

      cont.appendChild(card);
    });
  })
  .catch(() => {
    document.getElementById("catalogo").innerHTML =
      "<p style='padding:20px'>❌ Error cargando catálogo</p>";
  });
