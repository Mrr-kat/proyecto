const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para analizar JSON y servir archivos estáticos desde la raíz del proyecto
app.use(express.json());
app.use(express.static(path.join(__dirname, "../../")));  // Ajusta la ruta para servir estáticos desde la raíz

// Ruta principal (sirve index.html)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../index.html"));
});

// Ruta para obtener todos los usuarios
app.get("/api/usuarios", (req, res) => {
    const usuarios = leerUsuarios();
    res.json(usuarios);
});

// Ruta para registrar un nuevo usuario
app.post("/api/usuarios", (req, res) => {
    const { nombreUsuario, nombreCompleto, email, password } = req.body;
    if (!nombreUsuario || !nombreCompleto || !email || !password) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    let usuarios = leerUsuarios();

    const existe = usuarios.find(u => u.nombreUsuario === nombreUsuario);
    if (existe) {
        return res.status(400).json({ error: "El nombre de usuario ya existe." });
    }

    const nuevoUsuario = {
        id: usuarios.length > 0 ? usuarios[usuarios.length - 1].id + 1 : 1,
        nombreUsuario,
        nombreCompleto,
        email,
        password
    };

    usuarios.push(nuevoUsuario);
    escribirUsuarios(usuarios);

    res.status(201).json({ mensaje: "Usuario registrado exitosamente." });
});

// Ruta para validar login
app.post("/api/login", (req, res) => {
    const { nombreUsuario, password } = req.body;
    if (!nombreUsuario || !password) {
        return res.status(400).json({ error: "Usuario y contraseña requeridos." });
    }

    const usuarios = leerUsuarios();
    const usuario = usuarios.find(u => u.nombreUsuario === nombreUsuario);

    if (!usuario || usuario.password !== password) {
        return res.status(401).json({ error: "Usuario o contraseña incorrectos." });
    }

    res.json(usuario);
});

// Funciones auxiliares para leer y escribir usuarios
function leerUsuarios() {
    const filePath = path.join(__dirname, "../../BD_usuarios/usuarios.json");
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]));
    }
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
}

function escribirUsuarios(usuarios) {
    const filePath = path.join(__dirname, "../../BD_usuarios/usuarios.json");
    fs.writeFileSync(filePath, JSON.stringify(usuarios, null, 2));
}

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
