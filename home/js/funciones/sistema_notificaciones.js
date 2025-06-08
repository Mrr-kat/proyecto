// Notificaciones
function solicitarPermisoNotificaciones() {
    if ('Notification' in window && Notification.permission !== 'granted') {
        Notification.requestPermission().then(permission => {
            if (permission !== 'granted') {
                console.warn("Permiso de notificaciones denegado");
            }
        });
    }
}

function enviarNotificacion(titulo, mensaje) {
    if (Notification.permission === 'granted') {
        new Notification(titulo, {
            body: mensaje,
            icon: './img/logo.PNG'
        });
    }
}

function FechaLocal(fechaStr) {
    const [año, mes, dia] = fechaStr.split("-").map(Number);
    return new Date(año, mes - 1, dia);
}

function verificarFechasParaNotificaciones() {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const recordatorios = JSON.parse(localStorage.getItem('listDEscrip')) || [];

    recordatorios.forEach(element => {
        const fechaRecordatorio = FechaLocal(element.Fecha);
        fechaRecordatorio.setHours(0, 0, 0, 0);

        const diferenciaDias = Math.floor((fechaRecordatorio - hoy) / (1000 * 60 * 60 * 24));

        let titulo = "";
        let mensaje = "";

        switch (diferenciaDias) {
            case 0:
                titulo = "¡Recordatorio para hoy!";
                mensaje = `La tarea "${element.Titulo}" vence hoy.`;
                break;
            case 1:
                titulo = "Recordatorio para mañana";
                mensaje = `La tarea "${element.Titulo}" vence mañana.`;
                break;
            case 2:
                titulo = "Recordatorio para pasado mañana";
                mensaje = `La tarea "${element.Titulo}" vence pasado mañana.`;
                break;
            case 3:
                titulo = "Recordatorio para 3 días";
                mensaje = `La tarea "${element.Titulo}" vence en 3 días.`;
                break;
            case 4:
                titulo = "Recordatorio para 4 días";
                mensaje = `La tarea "${element.Titulo}" vence en 4 días.`;
                break;
            case 5:
                titulo = "Recordatorio para 5 días";
                mensaje = `La tarea "${element.Titulo}" vence en 5 días.`;
                break;
        }

        if (mensaje !== "") {
            enviarNotificacion(titulo, mensaje);
        }
    });
}