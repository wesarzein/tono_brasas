document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("inventarioForm");
  const tabla = document.querySelector("#tablaInventario tbody");
  const productoInput = document.getElementById("producto");
  const cantidadInput = document.getElementById("cantidad");
  const unidadInput = document.getElementById("unidad");
  const minimoInput = document.getElementById("minimo");

  // Cargar inventario desde Firebase
  async function cargarInventario() {
    const snapshot = await db.ref("inventario").once("value");
    const inventarioObj = snapshot.val() || {};
    const inventario = Object.values(inventarioObj);

    tabla.innerHTML = inventario.map(d => `
      <tr class="${parseFloat(d.cantidad) <= parseFloat(d.minimo) ? 'alerta' : ''}">
        <td>${d.producto}</td>
        <td>${d.cantidad}</td>
        <td>${d.unidad}</td>
        <td>${d.minimo_alerta}</td>
      </tr>
    `).join("");
  }

  // Guardar nuevo insumo
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const id = "I" + Date.now();
    const data = {
      id,
      producto: productoInput.value.trim(),
      cantidad: parseFloat(cantidadInput.value),
      unidad: unidadInput.value.trim(),
      minimo: parseFloat(minimoInput.value)
    };

    await db.ref("inventario/" + id).set(data);

    form.reset();
    alert("Insumo registrado");
    cargarInventario();
  });

  cargarInventario();
});
