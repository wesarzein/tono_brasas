// ======= CONFIGURACIÓN GENERAL =======
const SHEET_ID = "TU_ID_DE_HOJA"; // Reemplázalo por el ID real de tu hoja

// ======= FUNCIÓN PRINCIPAL =======
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const { action, payload } = data;

    switch (true) {
      case action.startsWith("addReserva"):
      case action.startsWith("getReservas"):
        return respond(handleReservas(action, payload));

      case action.startsWith("addPedido"):
      case action.startsWith("getPedidos"):
        return respond(handlePedidos(action, payload));

      case action.startsWith("addInventario"):
      case action.startsWith("getInventario"):
        return respond(handleInventario(action, payload));

      case action.startsWith("addFactura"):
      case action.startsWith("getFacturacion"):
        return respond(handleFacturacion(action, payload));

      default:
        return respond({ status: "unknown_action" });
    }

  } catch (err) {
    return respond({ status: "error", message: err.toString() });
  }
}

// ======= FUNCIÓN DE RESPUESTA JSON =======
function respond(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ======= RESERVAS =======
function handleReservas(action, data) {
  const sh = SpreadsheetApp.openById(SHEET_ID).getSheetByName("Reservas");

  if (action === "addReserva") {
    sh.appendRow([
      new Date(),
      data.nombre,
      data.correo,
      data.fecha,
      data.hora,
      data.personas,
      "Pendiente"
    ]);
    return { status: "success" };
  }

  if (action === "getReservas") {
    const values = sh.getDataRange().getValues();
    const headers = values.shift();
    const records = values.map(r => ({
      fecha_registro: r[0],
      nombre: r[1],
      correo: r[2],
      fecha: r[3],
      hora: r[4],
      personas: r[5],
      estado: r[6]
    }));
    return { status: "success", records };
  }

  return { status: "unknown_action" };
}

// ======= PEDIDOS =======
function handlePedidos(action, data) {
  const sh = SpreadsheetApp.openById(SHEET_ID).getSheetByName("Pedidos");

  if (action === "addPedido") {
    sh.appendRow([
      new Date(),
      data.cliente,
      data.producto,
      data.cantidad,
      data.precio,
      data.estado || "Pendiente"
    ]);
    return { status: "success" };
  }

  if (action === "getPedidos") {
    const values = sh.getDataRange().getValues();
    const headers = values.shift();
    const records = values.map(r => ({
      fecha: r[0],
      cliente: r[1],
      producto: r[2],
      cantidad: r[3],
      precio: r[4],
      estado: r[5]
    }));
    return { status: "success", records };
  }

  return { status: "unknown_action" };
}

// ======= INVENTARIO =======
function handleInventario(action, data) {
  const sh = SpreadsheetApp.openById(SHEET_ID).getSheetByName("Inventario");

  if (action === "addInventario") {
    sh.appendRow([
      new Date(),
      data.producto,
      data.categoria,
      data.stock,
      data.unidad,
      data.precio_unitario
    ]);
    return { status: "success" };
  }

  if (action === "getInventario") {
    const values = sh.getDataRange().getValues();
    const headers = values.shift();
    const records = values.map(r => ({
      fecha: r[0],
      producto: r[1],
      categoria: r[2],
      stock: r[3],
      unidad: r[4],
      precio_unitario: r[5]
    }));
    return { status: "success", records };
  }

  return { status: "unknown_action" };
}

// ======= FACTURACIÓN =======
function handleFacturacion(action, data) {
  const sh = SpreadsheetApp.openById(SHEET_ID).getSheetByName("Facturacion");

  if (action === "addFactura") {
    sh.appendRow([
      new Date(),
      data.cliente,
      data.monto,
      data.metodo_pago,
      data.estado || "Emitida"
    ]);
    return { status: "success" };
  }

  if (action === "getFacturacion") {
    const values = sh.getDataRange().getValues();
    const headers = values.shift();
    const records = values.map(r => ({
      fecha: r[0],
      cliente: r[1],
      monto: r[2],
      metodo_pago: r[3],
      estado: r[4]
    }));
    return { status: "success", records };
  }

  return { status: "unknown_action" };
}
