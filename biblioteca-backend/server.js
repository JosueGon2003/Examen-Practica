const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const pool = require("./db");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rutas
const librosRoutes = require("./routes/libros");
const estudiantesRoutes = require("./routes/estudiantes");
const prestamosRoutes = require("./routes/prestamos");

app.use("/api/libros", librosRoutes);
app.use("/api/estudiantes", estudiantesRoutes);
app.use("/api/prestamos", prestamosRoutes);

// Configurar el puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});