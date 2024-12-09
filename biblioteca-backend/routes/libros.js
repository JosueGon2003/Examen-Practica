const express = require("express");
const router = express.Router();
const pool = require("../db");

// Obtener todos los libros
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM libros");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear un nuevo libro
router.post("/", async (req, res) => {
  const { codigo, tipo, categoria_id, editorial, nombre, autor, anio_publicacion } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO libros (codigo, tipo, categoria_id, editorial, nombre, autor, anio_publicacion) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [codigo, tipo, categoria_id, editorial, nombre, autor, anio_publicacion]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Editar un libro (actualizar)
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { codigo, tipo, categoria_id, editorial, nombre, autor, anio_publicacion } = req.body;
  try {
    const result = await pool.query(
      "UPDATE libros SET codigo=$1, tipo=$2, categoria_id=$3, editorial=$4, nombre=$5, autor=$6, anio_publicacion=$7 WHERE id=$8 RETURNING *",
      [codigo, tipo, categoria_id, editorial, nombre, autor, anio_publicacion, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Eliminar un libro
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM libros WHERE id=$1", [id]);
    res.json({ message: "Libro eliminado" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;



module.exports = router;