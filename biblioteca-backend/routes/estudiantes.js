const express = require("express");
const router = express.Router();
const pool = require("../db");

// Obtener todos los estudiantes y manejar sanciones
router.get("/", async (req, res) => {
  try {
    // Actualizar automáticamente el estado de sanciones según la fecha
    await pool.query(`
      UPDATE estudiantes
      SET sancionado = false, sancion_hasta = NULL
      WHERE sancion_hasta <= CURRENT_DATE
    `);

    // Consultar todos los estudiantes con el estado actualizado
    const result = await pool.query(`
      SELECT id, cedula, nombre, apellido, sexo, fecha_nacimiento, sancionado, sancion_hasta
      FROM estudiantes
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Crear un nuevo estudiante
router.post("/", async (req, res) => {
  const { cedula, nombre, apellido, sexo, fecha_nacimiento } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO estudiantes (cedula, nombre, apellido, sexo, fecha_nacimiento) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [cedula, nombre, apellido, sexo, fecha_nacimiento]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// Editar un estudiante (actualizar)
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { cedula, nombre, apellido, sexo, fecha_nacimiento, sancionado, sancion_hasta } = req.body;
  try {
    const result = await pool.query(
      "UPDATE estudiantes SET cedula=$1, nombre=$2, apellido=$3, sexo=$4, fecha_nacimiento=$5, sancionado=$6, sancion_hasta=$7 WHERE id=$8 RETURNING *",
      [cedula, nombre, apellido, sexo, fecha_nacimiento, sancionado, sancion_hasta, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Eliminar un estudiante
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM estudiantes WHERE id=$1", [id]);
    res.json({ message: "Estudiante eliminado" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
