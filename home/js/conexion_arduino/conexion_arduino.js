let puertoSerial;
let escritorSerial;
let bombaEncendida = false;

async function alternarBomba() {
  // Conectarse al puerto serial si aún no está hecho
  if (!puertoSerial) {
    try {
      puertoSerial = await navigator.serial.requestPort();
      await puertoSerial.open({ baudRate: 9600 });

      const encoder = new TextEncoderStream();
      encoder.readable.pipeTo(puertoSerial.writable);
      escritorSerial = encoder.writable.getWriter();
    } catch (error) {
      alert("No se pudo conectar al Arduino.");
      console.error(error);
      return;
    }
  }

  // Alternar estado de la bomba
  bombaEncendida = !bombaEncendida;

  try {
    if (bombaEncendida) {
      await escritorSerial.write("1");
      document.getElementById("texto_estado").textContent = "ENCENDIDA";
      document.getElementById("boton_control_bomba").textContent = "APAGAR BOMBA";
      document.getElementById("boton_control_bomba").classList.remove("btn_bomba_apagada");
      document.getElementById("boton_control_bomba").classList.add("btn_bomba_encendida");
    } else {
      await escritorSerial.write("0");
      document.getElementById("texto_estado").textContent = "APAGADA";
      document.getElementById("boton_control_bomba").textContent = "ENCENDER BOMBA";
      document.getElementById("boton_control_bomba").classList.remove("btn_bomba_encendida");
      document.getElementById("boton_control_bomba").classList.add("btn_bomba_apagada");
    }
  } catch (error) {
    alert("Error al comunicar con el Arduino.");
    console.error(error);
  }
}

// Función para activar la bomba según el recordatorio
function programarBomba() {
  const listDEscrip = JSON.parse(localStorage.getItem('listDEscrip')) || [];

  listDEscrip.forEach(tarea => {
    if (tarea.bombaActiva) {
      const fechaTarea = tarea.Fecha;  // Formato: "YYYY-MM-DD"
      const horaBomba = tarea.horaBomba;
      const duracionBomba = parseInt(tarea.duracionBomba) * 60000; // minutos a milisegundos

      // Obtenemos la fecha y hora completa de activación
      const [anio, mes, dia] = fechaTarea.split('-').map(num => parseInt(num));
      const [hora, minuto] = horaBomba.split(':').map(num => parseInt(num));

      const fechaHoraActivacion = new Date(anio, mes - 1, dia, hora, minuto, 0, 0);
      const ahora = new Date();

      const tiempoRestante = fechaHoraActivacion.getTime() - ahora.getTime();

      // Si la fecha y hora aún no han pasado
      if (tiempoRestante > 0) {
        console.log(`Bomba programada para ${fechaHoraActivacion} en ${tiempoRestante / 1000} segundos`);

        setTimeout(async () => {
          await alternarBomba(); // Encender bomba

          setTimeout(async () => {
            await alternarBomba(); // Apagar bomba
          }, duracionBomba);

        }, tiempoRestante);
      } else {
        console.log(`La fecha y hora de la tarea ya pasaron o no son válidas: ${fechaHoraActivacion}`);
      }
    }
  });
}

