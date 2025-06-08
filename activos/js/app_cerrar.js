const cerrarSesionBtn = document.getElementById("cerrar_sesionBTN");
if (cerrarSesionBtn) {
    cerrarSesionBtn.addEventListener("click", () => {
        // Borrar usuarioActual del localStorage
        localStorage.removeItem("usuarioActual");

        // Opcional: limpiar otros datos como mensajeLogin
        localStorage.removeItem("mensajeLogin");

        // Redirigir al login
        window.location.href = "../../formularios/login.html";
    });
}
