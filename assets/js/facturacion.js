document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("facturaForm");
  const tabla = document.querySelector("#tablaFacturas tbody");
  const clienteInput = document.getElementById("cliente");
  const montoInput = document.getElementById("monto");
  const tipoSelect = document.getElementById("tipo");

  // Cargar facturas desde Firebase
  async function cargarFacturas() {
    const snapshot = await db.ref("facturacion").orderByChild("fecha").once("value");
    const facturasObj = snapshot.val() || {};
    const facturas = Object.values(facturasObj).sort((a,b) => b.fecha.localeCompare(a.fecha));

    tabla.innerHTML = facturas.map(f => `
      <tr>
        <td>${f.cliente}</td>
        <td>S/ ${parseFloat(f.monto).toFixed(2)}</td>
        <td>${f.tipo_comprobante}</td>
        <td>${f.fecha}</td>
      </tr>
    `).join("");
  }

  // Enviar nueva factura
  form.addEventListener("submit", async e => {
    e.preventDefault();

    const fecha = new Date().toLocaleDateString();
    const id = "F" + Date.now();
    const data = {
      id,
      cliente: clienteInput.value.trim(),
      monto: parseFloat(montoInput.value),
      tipo: tipoSelect.value,
      fecha
    };

    await db.ref("facturacion/" + id).set(data);

    form.reset();
    alert("Comprobante emitido correctamente");
    cargarFacturas();
  });

  cargarFacturas();
});
