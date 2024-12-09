const express = require("express");
const router = express.Router();
const pool = require("../db");

// Crear un nuevo préstamo
router.post("/", async (req, res) => {
  const { estudiante_id, libro_id, fecha_prestamo, fecha_entrega } = req.body;
  try {
    // Verificar si el estudiante está sancionado
    const sancionado = await pool.query(
      "SELECT sancionado FROM estudiantes WHERE id = $1",
      [estudiante_id]
    );

    if (sancionado.rows[0].sancionado) {
      return res.status(403).json({ message: "El estudiante está sancionado y no puede realizar préstamos." });
    }

    // Verificar si el libro está disponible
    const libroCheck = await pool.query("SELECT disponible FROM libros WHERE id=$1", [libro_id]);
    if (!libroCheck.rows[0]?.disponible) {
      return res.status(400).json({ message: "El libro no está disponible." });
    }

    // Crear el préstamo
    const result = await pool.query(
      "INSERT INTO prestamos (estudiante_id, libro_id, fecha_prestamo, fecha_entrega) VALUES ($1, $2, $3, $4) RETURNING *",
      [estudiante_id, libro_id, fecha_prestamo, fecha_entrega]
    );

    // Marcar el libro como no disponible
    await pool.query("UPDATE libros SET disponible=false WHERE id=$1", [libro_id]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Obtener todos los préstamos con información detallada
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, 
             e.nombre AS estudiante_nombre, 
             e.apellido AS estudiante_apellido, 
             e.sancionado, 
             e.sancion_hasta, 
             l.nombre AS libro_nombre,
             (CASE 
               WHEN e.sancionado = true AND e.sancion_hasta > CURRENT_DATE THEN true
               ELSE false
             END) AS sancionado_actual
      FROM prestamos p
      JOIN estudiantes e ON p.estudiante_id = e.id
      JOIN libros l ON p.libro_id = l.id
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Actualizar devolución del libro
router.put("/:id/devolucion", async (req, res) => {
  const { id } = req.params;
  const { fecha_devolucion } = req.body;

  try {
    const prestamo = await pool.query(
      "SELECT * FROM prestamos WHERE id = $1",
      [id]
    );

    if (prestamo.rows.length === 0) {
      return res.status(404).json({ message: "Préstamo no encontrado" });
    }

    const { fecha_entrega, estudiante_id, libro_id } = prestamo.rows[0];

    // Actualizar la fecha de devolución
    await pool.query(
      "UPDATE prestamos SET fecha_devolucion = $1 WHERE id = $2",
      [fecha_devolucion, id]
    );

     // Verificar si el estudiante debe ser sancionado
     if (new Date(fecha_devolucion) > new Date(fecha_entrega)) {
      const sancionHasta = new Date(fecha_devolucion); // Fecha base es la fecha de devolución
      sancionHasta.setDate(sancionHasta.getDate() + 16); // Sumar 15 días a partir de la fecha de devolución

      await pool.query(
        "UPDATE estudiantes SET sancionado = true, sancion_hasta = $1 WHERE id = $2",
        [sancionHasta, estudiante_id]
      );
    }
    // Marcar el libro como disponible
    await pool.query("UPDATE libros SET disponible = true WHERE id = $1", [libro_id]);

    res.json({ message: "Devolución registrada, libro disponible, y sanción aplicada si es necesario" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al registrar la devolución" });
  }
});


module.exports = router;
