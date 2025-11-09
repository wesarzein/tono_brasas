// Verifica que el usuario sea admin
function requireAdmin() {
  const u = JSON.parse(localStorage.getItem("user") || "null");
  if (!(u && u.role === "admin")) {
    window.location.href = "login.html";
    return false;
  }
  return true;
}

// Cargar pedidos desde Firebase
async function cargarPedidos() {
  const tbody = document.getElementById("tbodyPedidos");
  tbody.innerHTML = "<tr><td colspan='8'>Cargando...</td></tr>";

  try {
    const snapshot = await db.ref("reservas").orderByChild("timestamp").once("value");
    const pedidosObj = snapshot.val() || {};
    const pedidos = Object.values(pedidosObj).sort((a,b)=>b.timestamp.localeCompare(a.timestamp));

    if (pedidos.length === 0) {
      tbody.innerHTML = "<tr><td colspan='8'>Sin pedidos</td></tr>";
      return;
    }

    tbody.innerHTML = pedidos.map(r => `
      <tr>
        <td>${r.timestamp || ""}</td>
        <td>${r.id || ""}</td>
        <td>${r.cliente || ""}</td>
        <td>${r.telefono || ""}</td>
        <td style="text-align:left">${(r.pedido || "").substring(0, 200)}</td>
        <td>${r.total || ""}</td>
        <td>${r.estado || ""}</td>
      </tr>
    `).join("");

  } catch (err) {
    console.error(err);
    tbody.innerHTML = "<tr><td colspan='8'>Error de conexión</td></tr>";
  }
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  if (!requireAdmin()) return;
  cargarPedidos();
});
