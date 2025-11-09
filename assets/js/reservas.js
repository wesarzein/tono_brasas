const menuList = document.getElementById("menuList");
const totalSpan = document.getElementById("total");
const msg = document.getElementById("msg");
const form = document.getElementById("formReserva");

// === CARGAR MENÚ DESDE FIREBASE ===
async function loadMenu() {
  console.log("loadMenu ejecutándose...");
  try {
    const snapshot = await db.ref("menu").once("value");
    const menu = snapshot.val();
    if (menu) renderMenu(Object.values(menu));
    else msg.textContent = "No hay menú disponible.";
  } catch (err) {
    console.error(err);
    msg.textContent = "Error al cargar menú.";
  }
}

// === RENDERIZAR MENÚ ===
function renderMenu(menu) {
  menuList.innerHTML = "";
  menu.forEach(item => {
    if (!item.Disponible || String(item.Disponible).toLowerCase() === "sí" || String(item.Disponible).toLowerCase() === "si") {
      const div = document.createElement("div");
      div.className = "menu-item";
      div.innerHTML = `
        <label>
          <input type="checkbox" class="menu-check" data-nombre="${item.nombre}" data-precio="${item.precio}">
          <span class="meta">
            <strong>${item.nombre}</strong>
            <small>S/ ${parseFloat(item.precio).toFixed(2)}</small>
            <em>${item.Descripción || ""}</em>
          </span>
        </label>
        <input type="number" class="qty" min="1" value="1" style="width:70px; display:inline-block;">
      `;
      menuList.appendChild(div);
    }
  });
}

// === CALCULAR TOTAL ===
function calcTotal() {
  let total = 0;
  document.querySelectorAll(".menu-item").forEach(mi => {
    const checkbox = mi.querySelector(".menu-check");
    const qty = mi.querySelector(".qty");
    if (checkbox && checkbox.checked) {
      total += parseFloat(checkbox.dataset.precio) * (parseInt(qty.value) || 1);
    }
  });
  totalSpan.textContent = total.toFixed(2);
  return total;
}

// === ENVIAR FORMULARIO ===
form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.style.color = "#333";
  msg.textContent = "Enviando reserva...";

  const selected = [];
  document.querySelectorAll(".menu-item").forEach(mi => {
    const cb = mi.querySelector(".menu-check");
    const qty = mi.querySelector(".qty");
    if (cb && cb.checked) {
      const nombre = cb.dataset.nombre;
      const q = Math.max(1, parseInt(qty.value) || 1);
      selected.push({ nombre, cantidad: q });
    }
  });

  if (selected.length === 0) {
    msg.style.color = "red";
    msg.textContent = "Selecciona al menos un plato.";
    return;
  }

  const total = calcTotal();
  const reserva = {
    timestamp: new Date().toISOString(),
    cliente: form.nombre.value.trim(),
    telefono: form.telefono.value.trim(),
    correo: form.correo.value.trim(),
    fecha: form.fecha.value,
    hora: form.hora.value,
    personas: form.personas.value,
    pedido: selected,
    total: total.toFixed(2),
    estado: "Pendiente"
  };

  try {
    const newRef = db.ref("reservas").push();
    await newRef.set(reserva);

    msg.style.color = "green";
    msg.textContent = "Reserva enviada correctamente.";
    form.reset();
    document.querySelectorAll(".menu-check").forEach(c => c.checked = false);
    calcTotal();
  } catch (err) {
    console.error(err);
    msg.style.color = "red";
    msg.textContent = "Error al enviar reserva.";
  }
});

menuList?.addEventListener("change", calcTotal);
menuList?.addEventListener("input", calcTotal);
window.addEventListener("load", loadMenu);
