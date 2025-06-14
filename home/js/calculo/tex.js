const displayValorAnterior = document.getElementById('valor_anterior');
const displayValorActual = document.getElementById('valor_actual');
const botonesNumeros = document.querySelectorAll('.numero');
const botonesOperadores = document.querySelectorAll('.operador');
const botonBorrar = document.getElementById('borrar');
const botonBorrarTodo = document.getElementById('borrar_todo');

const display = new Display(displayValorAnterior, displayValorActual);

botonesNumeros.forEach(boton => {
    boton.addEventListener('click', () => display.agregarNumero(boton.value));
});

botonesOperadores.forEach(boton => {
    boton.addEventListener('click', () => display.computar(boton.value));
});

botonBorrar.addEventListener('click', () => display.borrar());
botonBorrarTodo.addEventListener('click', () => display.borrarTodo());