function filtrarUrgentes() {
    const listDEscrip = JSON.parse(localStorage.getItem('listDEscrip')) || [];
    const hoy = new Date();
    hoy.setHours(0,0,0,0);

    // Llenamos sólo las urgentes
    const urgentes = listDEscrip.filter(tarea => {
        const fecha = FechaLocal(tarea.Fecha);
        return fecha >= hoy && fecha <= new Date(hoy.getTime() + 3 * 24 * 60 * 60 * 1000);
    });

    let html = "";
    urgentes.forEach((element, idx) => {
        html += `<div class='cont Estil_urgente' id='urgente_${idx}'>`;
        html += `<div class='cap'>Título: <p class='titulo'>${element.Titulo}</p></div>`;
        html += `<p class='tituloDesc'>Descripción:</p>`;
        html += `<p class='descripcion'>${element.Descripcion}</p>`;
        html += `<p class='tituloFech'>Fecha: <span class='fecha'>${element.Fecha}</span></p>`;

        //botones:
        html += `<button onclick="borrar_recordatorio(${idx})" class="btnE btn_EU">Eliminar</button>`;
        html += `</div>`;
    });

    // Inyectar en el contenedor de urgentes
    document.getElementById('contenedor_tareas_urgentes').innerHTML = html;
}
