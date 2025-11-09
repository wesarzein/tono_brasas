document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("promoForm");
  const lista = document.getElementById("listaPromos");

  // Leer promociones desde localStorage
  function leerPromos() {
    const promos = localStorage.getItem("promos");
    return promos ? JSON.parse(promos) : [];
  }

  // Guardar promociones en localStorage
  function guardarPromos(promos) {
    localStorage.setItem("promos", JSON.stringify(promos));
  }

  // Renderizar promociones en la página
  function cargarPromos() {
    const promos = leerPromos();
    if (promos.length === 0) {
      lista.innerHTML = `<p style="text-align:center; color:#555;">No hay promociones activas.</p>`;
      return;
    }
    lista.innerHTML = promos.map(p => `
      <div class="promo-card">
        <h3>${p.titulo}</h3>
        <p>${p.descripcion}</p>
        <span>${p.descuento}% OFF</span>
      </div>
    `).join("");
  }

  // Evento submit del formulario
  form.addEventListener("submit", e => {
    e.preventDefault();

    const nuevaPromo = {
      titulo: form.titulo.value.trim(),
      descripcion: form.descripcion.value.trim(),
      descuento: form.descuento.value.trim()
    };

    if (!nuevaPromo.titulo || !nuevaPromo.descripcion || !nuevaPromo.descuento) {
      alert("Por favor completa todos los campos");
      return;
    }

    const promos = leerPromos();
    promos.push(nuevaPromo);
    guardarPromos(promos);

    form.reset();
    cargarPromos();
    alert("Promoción publicada");
  });

  // Cargar promociones al iniciar
  cargarPromos();
});
