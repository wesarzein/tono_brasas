document.addEventListener("DOMContentLoaded", () => {
  const ADMIN_IDS = ["pedidos", "facturacion", "inventario", "marketing", "reportes"];
  const PUBLIC_IDS = ["inicio", "carta", "reservas", "contacto"];

  const accederLi = document.getElementById("acceder")?.closest("li");
  const salirLi = document.getElementById("salir")?.closest("li");
  const footer = document.querySelector("footer");

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user && user.role === "admin";

  function toggleMenus(admin) {
    ADMIN_IDS.forEach(id => {
      const li = document.getElementById(id)?.closest("li");
      if (li) li.style.display = admin ? "" : "none";
    });

    PUBLIC_IDS.forEach(id => {
      const li = document.getElementById(id)?.closest("li");
      if (li) li.style.display = admin ? "none" : "";
    });

    if (accederLi) accederLi.style.display = admin ? "none" : "";
    if (salirLi) salirLi.style.display = admin ? "" : "none";
    if (footer) footer.style.display = admin ? "none" : "";
  }

  // Estado inicial
  toggleMenus(isAdmin);

  // Login
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", e => {
      e.preventDefault();
      const username = document.getElementById("usuario")?.value.trim();
      const password = document.getElementById("clave")?.value.trim();

      if (username === "admin" && password === "1234") {
        localStorage.setItem("user", JSON.stringify({ username, role: "admin" }));
        window.location.href = "reportes.html";
      } else {
        alert("Usuario o contraseña incorrectos.");
      }
    });
  }

  // Logout
  const salir = document.getElementById("salir");
  if (salir) {
    salir.addEventListener("click", e => {
      e.preventDefault();
      localStorage.removeItem("user");
      toggleMenus(false);
      window.location.href = "index.html";
    });
  }

  // Protección de páginas admin
  const adminPages = ["pedidos.html", "facturacion.html", "inventario.html", "marketing.html", "reportes.html"];
  const current = window.location.pathname.split("/").pop();
  if (adminPages.includes(current) && !isAdmin) {
    window.location.href = "login.html";
  }
});
