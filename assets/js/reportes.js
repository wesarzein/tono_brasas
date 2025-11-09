// assets/js/reportes.js
document.addEventListener("DOMContentLoaded", async () => {
  if (!firebase || !firebase.database) {
    console.error("Firebase no está inicializado correctamente");
    return;
  }

  const db = firebase.database();

  // === VENTAS (RESERVAS) ===
  const tbodyVentas = document.querySelector("#tablaVentas tbody");
  const graficoVentasCtx = document.getElementById("graficoVentas").getContext("2d");

  try {
    const reservasSnap = await db.ref("reservas").once("value");
    const reservasObj = reservasSnap.val() || {};
    const reservas = Object.entries(reservasObj).map(([id, data]) => ({ id, ...data }));

    tbodyVentas.innerHTML = reservas.map(r => `
      <tr>
        <td>${r.timestamp || ""}</td>
        <td>${r.id || ""}</td>
        <td>${r.nombre || r.cliente || ""}</td>
        <td>${r.telefono || ""}</td>
        <td style="text-align:left">${(r.pedido || "").substring(0,200)}</td>
        <td>${r.total || ""}</td>
        <td>${r.estado || ""}</td>
      </tr>
    `).join("");

    new Chart(graficoVentasCtx, {
      type: "bar",
      data: {
        labels: reservas.map(r => r.nombre || r.cliente),
        datasets: [{
          label: "Total (S/)",
          data: reservas.map(r => parseFloat(r.total) || 0),
          backgroundColor: "rgba(54, 162, 235, 0.6)"
        }]
      },
      options: { responsive: true }
    });
  } catch (err) {
    console.error("Error cargando reservas:", err);
    tbodyVentas.innerHTML = "<tr><td colspan='7'>Error cargando reservas</td></tr>";
  }

  // === INSUMOS (INVENTARIO) ===
  const tbodyInsumos = document.querySelector("#tablaInsumos tbody");
  const graficoInsumosCtx = document.getElementById("graficoInsumos").getContext("2d");

  try {
    const inventarioSnap = await db.ref("inventario").once("value");
    const inventarioObj = inventarioSnap.val() || {};
    const inventario = Object.entries(inventarioObj).map(([id, data]) => ({ id, ...data }));

    tbodyInsumos.innerHTML = inventario.map(i => `
      <tr class="${parseInt(i.cantidad) <= parseInt(i.minimo) ? 'alerta' : ''}">
        <td>${i.producto}</td>
        <td>${i.cantidad}</td>
        <td>${i.unidad}</td>
        <td>${i.minimo_alerta}</td>
      </tr>
    `).join("");

    new Chart(graficoInsumosCtx, {
      type: "pie",
      data: {
        labels: inventario.map(i => i.producto),
        datasets: [{
          label: "Stock actual",
          data: inventario.map(i => parseInt(i.cantidad)),
          backgroundColor: inventario.map((_, idx) => `hsl(${(idx * 30) % 360}, 70%, 60%)`)
        }]
      },
      options: { responsive: true }
    });
  } catch (err) {
    console.error("Error cargando inventario:", err);
    tbodyInsumos.innerHTML = "<tr><td colspan='4'>Error cargando inventario</td></tr>";
  }
});
