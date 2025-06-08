// Mostrar tareas
function showData() {
    const listDEscrip = JSON.parse(localStorage.getItem('listDEscrip')) || [];
    let html = "";

    listDEscrip.forEach(function (element, index) {
        html += `<div class='cont' id='contenedor_tareas${index}'>`;
        html += `<div class='cap'>Título: <p class='titulo'>${element.Titulo}</p></div>`;
        html += `<p class='tituloDesc'>Descripción:</p>`;
        html += `<p class='descripcion'>${element.Descripcion}</p>`;
        html += `<p class='tituloFech'>Fecha: <span class='fecha'>${element.Fecha}</span></p>`;
        html += `<button onclick="borrar_recordatorio(${index})" class="btnE">Eliminar</button>`;
        html += `<button onclick="editar_tarea(${index})" class="btnM">Editar</button>`;
        html += `</div>`;
    });

    document.getElementById('contenedor_tareas').innerHTML = html;
}

// Validar formulario
function validateForm(formType) {
    let Titulo, Descripcion, Fecha;

    if (formType === 'create') {
        Titulo = document.getElementById('input_titulo').value;
        Descripcion = document.getElementById('input_descripcion').value;
        Fecha = document.getElementById('input_fecha').value;
    } else if (formType === 'edit') {
        Titulo = document.getElementById('editar_titulo').value;
        Descripcion = document.getElementById('editar_descripcion').value;
        Fecha = document.getElementById('editar_fecha').value;
    } else {
        return false;
    }

    if (Titulo.trim() === "") {
        alert('El título es requerido');
        return false;
    }

    if (Descripcion.trim() === "") {
        alert('La descripción es requerida');
        return false;
    }

    if (Fecha.trim() === "") {
        alert('La fecha es requerida');
        return false;
    }

    return true;
}

// Agregar tarea
function crear_tarea() {
    if (validateForm('create')) {
        const Titulo = document.getElementById('input_titulo').value;
        const Descripcion = document.getElementById('input_descripcion').value;
        const Fecha = document.getElementById('input_fecha').value;

        // Obtener datos de bomba si está activa
        const bombaActiva = document.getElementById('activar_bomba_checkbox').checked;
        let horaBomba = null;
        let duracionBomba = null;

        if (bombaActiva) {
            horaBomba = document.getElementById('hora_bomba_crear').value;
            duracionBomba = document.getElementById('duracion_bomba_crear').value;
        }

        const listDEscrip = JSON.parse(localStorage.getItem('listDEscrip')) || [];
        listDEscrip.push({Titulo,Descripcion,Fecha,bombaActiva,horaBomba,duracionBomba});

        localStorage.setItem('listDEscrip', JSON.stringify(listDEscrip));
        showData();
        verificarFechasParaNotificaciones();

        // Limpiar inputs
        document.getElementById('input_titulo').value = "";
        document.getElementById('input_descripcion').value = "";
        document.getElementById('input_fecha').value = "";
        document.getElementById('activar_bomba_checkbox').checked = false;
        mostrarOpcionesBomba('activar_bomba_checkbox', 'opciones_bomba_crear');

        salir();
    }
}

// Eliminar tarea
function borrar_recordatorio(index) {
    const listDEscrip = JSON.parse(localStorage.getItem('listDEscrip')) || [];
    listDEscrip.splice(index, 1);
    localStorage.setItem('listDEscrip', JSON.stringify(listDEscrip));

    // Siempre actualizar ambas vistas
    showData();         // Actualiza la sección Todo
    filtrarUrgentes();  // Actualiza la sección Urgente
}



// Editar tarea
function editar_tarea(index) {
    const listDEscrip = JSON.parse(localStorage.getItem('listDEscrip')) || [];

    if (!listDEscrip[index]) return;

    const tarea = listDEscrip[index];

    document.getElementById('editar_titulo').value = tarea.Titulo;
    document.getElementById('editar_descripcion').value = tarea.Descripcion;
    document.getElementById('editar_fecha').value = tarea.Fecha;

    // Cargar datos de bomba
    const checkbox = document.getElementById('editar_bomba_checkbox');
    checkbox.checked = tarea.bombaActiva || false;
    mostrarOpcionesBomba('editar_bomba_checkbox', 'opciones_bomba_editar');

    if (tarea.bombaActiva) {
        document.getElementById('hora_bomba_editar').value = tarea.horaBomba || "";
        document.getElementById('duracion_bomba_editar').value = tarea.duracionBomba || "1";
    }

    localStorage.setItem('editIndex', index);

    document.getElementById('seccion_editar').style.display = 'block';
    document.getElementById('cerrar_sesionBTN').style.display = 'none';
    document.getElementById('seccion_crear').style.display = 'none';
    document.getElementById('seccion_leer').style.display = 'none';
    document.getElementById('seccion_calculadora').style.display = 'none';
    document.getElementById('boton_agregar').style.display = 'none';
    document.getElementById('contenedor_navegacion').style.display = 'none';
}


// Actualizar tarea
function actualizar_recordatorio() {
    const editIndex = localStorage.getItem('editIndex');
    if (editIndex === null) return;

    if (validateForm('edit')) {
        const listDEscrip = JSON.parse(localStorage.getItem('listDEscrip')) || [];

        if (!listDEscrip[editIndex]) return;

        const bombaActiva = document.getElementById('editar_bomba_checkbox').checked;
        let horaBomba = null;
        let duracionBomba = null;

        if (bombaActiva) {
            horaBomba = document.getElementById('hora_bomba_editar').value;
            duracionBomba = document.getElementById('duracion_bomba_editar').value;
        }

        listDEscrip[editIndex] = {
            Titulo: document.getElementById('editar_titulo').value,
            Descripcion: document.getElementById('editar_descripcion').value,
            Fecha: document.getElementById('editar_fecha').value,
            bombaActiva,horaBomba,duracionBomba
        };

        localStorage.setItem('listDEscrip', JSON.stringify(listDEscrip));
        showData();
        verificarFechasParaNotificaciones();

        // Limpiar inputs edición
        document.getElementById('editar_titulo').value = "";
        document.getElementById('editar_descripcion').value = "";
        document.getElementById('editar_fecha').value = "";
        document.getElementById('editar_bomba_checkbox').checked = false;
        mostrarOpcionesBomba('editar_bomba_checkbox', 'opciones_bomba_editar');

        localStorage.removeItem('editIndex');
        salir();
    }
}




// Mostrar secciones según navegación
function establecer_activo(indice) {
    const items = document.querySelectorAll(".item_navegacion");
    items.forEach((item, i) => {
        item.classList.remove("item_activo");
        if (i === indice) item.classList.add("item_activo");
    });

    if (indice === 0 || indice === 1) {
        salir();
        if (indice === 1) filtrarUrgentes();
    } else if (indice === 2) {
        document.getElementById('seccion_calculadora').style.display = 'block';
        document.getElementById('seccion_leer').style.display = 'none';
        document.getElementById('seccion_crear').style.display = 'none';
        document.getElementById('seccion_editar').style.display = 'none';
        document.getElementById('boton_agregar').style.display = 'none';
        document.getElementById('contenedor_navegacion').style.display = 'block';
    }
}


// Al cargar la página
window.onload = function () {
    showData();
    programarBomba();
    solicitarPermisoNotificaciones();
    verificarFechasParaNotificaciones();
};
