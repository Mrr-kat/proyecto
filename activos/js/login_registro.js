// probz

class Usuario {
    constructor(nombreUsuario, nombreCompleto, email, password) {
        this.nombreUsuario = nombreUsuario;
        this.nombreCompleto = nombreCompleto;
        this.email = email;
        this.password = password;
    }

    static async registrarUsuario(usuario) {
        try {
            const response = await fetch("/api/usuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(usuario)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Error al registrar usuario.");
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    static async buscarUsuario(nombreUsuario) {
        try {
            const response = await fetch("/api/usuarios");
            const usuarios = await response.json();
            return usuarios.find(user => user.nombreUsuario === nombreUsuario);
        } catch (error) {
            console.error("Error al buscar usuario:", error);
            return null;
        }
    }

    static validarRegistro(nombreUsuario, nombreCompleto, email, password) {
        return nombreUsuario !== "" &&
            nombreCompleto !== "" &&
            email.includes("@") &&
            password.length >= 6;
    }

    static validarPassword(usuario, password) {
        return usuario.password === password;
    }

    static async iniciarSesion(nombreUsuario, password) {
        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ nombreUsuario, password })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Usuario o contraseña incorrectos.");
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }
}

// --------------------- Registro ---------------------
const formularioRegistro = document.getElementById("formularioRegistro");
if (formularioRegistro) {
    formularioRegistro.addEventListener("submit", async function (event) {
        event.preventDefault();

        const nombreUsuario = document.getElementById("usuario").value.trim();
        const nombreCompleto = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const mensaje = document.getElementById("mensajeRegistro");

        if (Usuario.validarRegistro(nombreUsuario, nombreCompleto, email, password)) {
            try {
                await Usuario.registrarUsuario({ nombreUsuario, nombreCompleto, email, password });
                mensaje.textContent = "✔ Registro exitoso. Ahora puedes iniciar sesión";
                mensaje.style.color = "green";
                formularioRegistro.reset();

                setTimeout(() => {
                    window.location.href = "login.html";
                }, 2000);
            } catch (error) {
                mensaje.textContent = `❌ ${error.message}`;
                mensaje.style.color = "red";
            }
        } else {
            mensaje.textContent = "❌ Error: Todos los campos son obligatorios. Email debe ser válido. Contraseña mínimo 6 caracteres";
            mensaje.style.color = "red";
        }
    });
}

// --------------------- Login ---------------------
const formularioLogin = document.getElementById("formularioLogin");
if (formularioLogin) {
    formularioLogin.addEventListener("submit", async function (event) {
        event.preventDefault();

        const nombreUsuario = document.getElementById("usuario").value.trim();
        const password = document.getElementById("contraseña").value;
        const mensaje = document.getElementById("mensajeLogin");

        try {
            const usuario = await Usuario.iniciarSesion(nombreUsuario, password);

            // Guardar usuario en sesión
            localStorage.setItem('usuarioActual', JSON.stringify(usuario));

            mensaje.textContent = `✔ Bienvenido ${usuario.nombreCompleto}`;
            mensaje.style.color = "green";

            setTimeout(() => {
                window.location.href = "../home/index.html";
            }, 1500);
        } catch (error) {
            mensaje.textContent = `❌ ${error.message}`;
            mensaje.style.color = "red";
        }
    });
}


// -------------------------------Verificar si hay sesión activa al cargar la página-------------------------------
window.addEventListener('load', () => {
  const usuarioActual = localStorage.getItem('usuarioActual');
  if (usuarioActual && window.location.pathname.includes("login.html")) {
      setTimeout(() => {
          window.location.href = "../home/index.html";
      }, 500);
  }

   // Mostrar mensaje de acceso denegado si viene en la URL
    const params = new URLSearchParams(window.location.search);
    const mensaje = params.get("mensaje");
    const mensajeLogin = document.getElementById("mensajeLogin");
    if (mensaje && mensajeLogin) {
        mensajeLogin.textContent = `⚠️ ${mensaje}`;
        mensajeLogin.style.color = "red";
    }

});