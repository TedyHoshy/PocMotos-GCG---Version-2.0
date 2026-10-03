window.addEventListener("DOMContentLoaded", () => {
    // Cargar solo lo necesario según la página actual
    if (document.getElementById("rep-mecanico") || document.getElementById("lista-mecanicos")) {
        cargarSelectMecanicos();
    }

    if (document.getElementById("select-modelo-moto") || document.getElementById("lista-repuestos") || document.getElementById("contenedor-repuestos")) {
        cargarSelectRepuestos();
    }

    if (document.getElementById("lista-historial")) {
        cargarHistorial();
    }
});
