function establecer_activo(indice) {
  // Remover clase activa de todos los elementos de navegación
  const elementos = document.querySelectorAll('.barra_navegacion ul .item_navegacion');
  elementos.forEach(elemento => elemento.classList.remove('item_activo'));
  
  // Agregar clase activa al elemento seleccionado
  elementos[indice].classList.add('item_activo');

  // Llamar a las funciones correspondientes
  const funciones = [mostrarTodo, mostrarUrgente, mostrarCalculadora, mostrarBomba];
  if (funciones[indice]) {
    funciones[indice]();
  }
}

function mostrarCrear() {
  document.getElementById('seccion_crear').style.display = 'block';
  document.getElementById('seccion_leer').style.display = 'none';
  document.getElementById('boton_agregar').style.display = 'none';
  document.getElementById('cerrar_sesionBTN').style.display = 'none';
  document.getElementById('boton_agregar').style.display = 'none';
  document.getElementById('contenedor_navegacion').style.display = 'none';
  document.getElementById('seccion_btn_bomba').style.display = 'none';
  document.getElementById('seccion_urgente').style.display = 'none';
}

function mostrarTodo() {
  document.getElementById('boton_agregar').style.display = 'block';
  document.getElementById('contenedor_navegacion').style.display = 'block';
  document.getElementById('seccion_leer').style.display = 'block';
  document.getElementById('seccion_crear').style.display = 'none';
  document.getElementById('seccion_editar').style.display = 'none';
  document.getElementById('seccion_calculadora').style.display = 'none';
  document.getElementById('seccion_btn_bomba').style.display = 'none';
  document.getElementById('seccion_urgente').style.display = 'none';
}

function mostrarUrgente() {
  document.getElementById('boton_agregar').style.display = 'none';
  document.getElementById('seccion_leer').style.display = 'none';
  document.getElementById('seccion_crear').style.display = 'none';
  document.getElementById('seccion_calculadora').style.display = 'none';
  document.getElementById('seccion_editar').style.display = 'none';
  document.getElementById('seccion_btn_bomba').style.display = 'none';
  document.getElementById('seccion_urgente').style.display = 'block';

  filtrarUrgentes();
}

function mostrarCalculadora() {
  document.getElementById('boton_agregar').style.display = 'none';
  document.getElementById('seccion_leer').style.display = 'none';
  document.getElementById('seccion_crear').style.display = 'none';
  document.getElementById('seccion_editar').style.display = 'none';
  document.getElementById('seccion_calculadora').style.display = 'block';
  document.getElementById('seccion_btn_bomba').style.display = 'none'; 
  document.getElementById('seccion_urgente').style.display = 'none';
}
function mostrarBomba() {
  document.getElementById('boton_agregar').style.display = 'none';
  document.getElementById('seccion_leer').style.display = 'none';
  document.getElementById('seccion_crear').style.display = 'none';
  document.getElementById('seccion_editar').style.display = 'none';
  document.getElementById('seccion_calculadora').style.display = 'none';
  document.getElementById('seccion_btn_bomba').style.display = 'block';
  document.getElementById('seccion_urgente').style.display = 'none';
}

function mostrarOpcionesBomba(checkboxId, opcionesId) {
  const checkbox = document.getElementById(checkboxId);
  const opciones = document.getElementById(opcionesId);

  if (checkbox.checked) {
    opciones.style.display = "block";
  } else {
    opciones.style.display = "none";
  }
}



function salir() {
  document.getElementById('seccion_crear').style.display = 'none';
  document.getElementById('seccion_editar').style.display = 'none';
  document.getElementById('boton_agregar').style.display = 'block';
  document.getElementById('seccion_leer').style.display = 'block';
  document.getElementById('contenedor_tareas').style.display = 'block';
  document.getElementById('contenedor_navegacion').style.display = 'block';
  document.getElementById('cerrar_sesionBTN').style.display = 'block';
  document.getElementById('seccion_btn_bomba').style.display = 'none'; 
  document.getElementById('seccion_urgente').style.display = 'none';
}
