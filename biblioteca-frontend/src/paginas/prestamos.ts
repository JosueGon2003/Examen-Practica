import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import {
  fetchPrestamos,
  createPrestamo,
  updateDevolucion,
} from "../controlador/prestamosControlador";
import { renderPrestamoForm } from "../components/FormPrestamo";
import { fetchEstudiantes } from "../controlador/estudiantesControlador";
import { fetchLibros } from "../controlador/librosControlador";
import { openDevolucionModal } from "../components/FormDevolucion";

export const renderPrestamosPage = async (): Promise<HTMLElement> => {
  const container = document.createElement("div");
  container.className =
    "p-6 bg-light rounded-lg shadow-lg max-w-7xl mx-auto mt-4 fade-in";

  // Botón para agregar préstamos
  const btnAgregar = document.createElement("button");
  btnAgregar.className =
    "btn btn-primary mb-4 w-100 w-sm-auto transition-all duration-300 ease-in-out transform hover:scale-105";
  btnAgregar.textContent = "Agregar Préstamo";
  btnAgregar.addEventListener("click", async () => {
    const estudiantes = await fetchEstudiantes();
    const validEstudiantes = estudiantes.filter((est) => !est.sancionado);
    const libros = await fetchLibros();

    const form = renderPrestamoForm(validEstudiantes, libros, async (prestamo) => {
      try {
        for (const libro_id of prestamo.libros_ids) {
          await createPrestamo({
            estudiante_id: prestamo.estudiante_id,
            libro_id,
            fecha_prestamo: prestamo.fecha_prestamo,
            fecha_entrega: prestamo.fecha_entrega,
          });
        }
        Swal.fire({
          title: "¡Éxito!",
          text: "Préstamo(s) creado(s) correctamente.",
          icon: "success",
          confirmButtonColor: "#007bff",
        }).then(async () => {
          const updatedPage = await renderPrestamosPage();
          container.innerHTML = ""; // Limpia el contenedor
          container.appendChild(updatedPage); // Muestra la página actualizada
        });
      } catch (err: any) {
        Swal.fire({
          title: "Error",
          text: err.message,
          icon: "error",
          confirmButtonColor: "#dc3545",
        });
      }
    });

    container.classList.add("fade-out");
    setTimeout(() => {
      container.innerHTML = "";
      container.classList.remove("fade-out");
      container.appendChild(form);
      form.classList.add("fade-in"); // Animación al mostrar el formulario
    }, 300);
  });

  container.appendChild(btnAgregar);

  // Renderizar tabla de préstamos
  const prestamos = await fetchPrestamos();
  const estudiantes = await fetchEstudiantes();
  const libros = await fetchLibros();

  const table = document.createElement("table");
  table.className =
    "table table-bordered table-hover table-responsive-lg transition-all duration-300 ease-in-out";
  table.innerHTML = `
    <thead class="thead-dark">
      <tr>
        <th>ID</th>
        <th>Estudiante</th>
        <th>Libro</th>
        <th>Fecha Préstamo</th>
        <th>Fecha Entrega</th>
        <th>Fecha Devolución</th>
        <th>Sancionado</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      ${prestamos
        .map((prestamo) => {
          const estudiante = estudiantes.find(
            (est) => est.id === prestamo.estudiante_id
          );
          const libro = libros.find((lib) => lib.id === prestamo.libro_id);
          const fechaPrestamo = new Date(prestamo.fecha_prestamo).toLocaleDateString("es-ES");
          const fechaEntrega = new Date(prestamo.fecha_entrega).toLocaleDateString("es-ES");
          const fechaDevolucion = prestamo.fecha_devolucion
            ? new Date(prestamo.fecha_devolucion).toLocaleDateString("es-ES")
            : "No devuelto";

          return `
            <tr class="transition-all duration-300 ease-in-out hover:bg-gray-100">
              <td>${prestamo.id}</td>
              <td>${estudiante ? estudiante.nombre : "Desconocido"}</td>
              <td>${libro ? libro.nombre : "Desconocido"}</td>
              <td>${fechaPrestamo}</td>
              <td>${fechaEntrega}</td>
              <td>${fechaDevolucion}</td>
              <td>${prestamo.sancionado ? "Sí" : "No"}</td>
              <td>
                ${
                  prestamo.fecha_devolucion
                    ? "Devolución registrada"
                    : `<button class="devolver-btn btn btn-warning btn-sm mx-1" data-id="${prestamo.id}">Devolver</button>`
                }
              </td>
            </tr>
          `;
        })
        .join("")}
    </tbody>
  `;
  container.appendChild(table);
  table.classList.add("fade-in"); // Animación al renderizar la tabla

  // Botones de devolución
  table.querySelectorAll(".devolver-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const prestamoId = Number(
        (event.target as HTMLButtonElement).dataset.id
      );
      const modal = openDevolucionModal(prestamoId, async (fechaDevolucion) => {
        try {
          await updateDevolucion(prestamoId, fechaDevolucion);
          Swal.fire({
            title: "¡Éxito!",
            text: "Devolución registrada exitosamente.",
            icon: "success",
            confirmButtonColor: "#007bff",
          }).then(async () => {
            const updatedPage = await renderPrestamosPage();
            container.innerHTML = ""; // Limpia el contenedor
            container.appendChild(updatedPage); // Muestra la página actualizada
          });
        } catch (err: any) {
          Swal.fire({
            title: "Error",
            text: err.message,
            icon: "error",
            confirmButtonColor: "#dc3545",
          });
        }
      });
      document.body.appendChild(modal);
    });
  });

  return container;
};

// Estilos personalizados para animaciones
const style = document.createElement("style");
style.textContent = `
  .fade-in {
    opacity: 0;
    animation: fadeIn 0.5s forwards;
  }
  .fade-out {
    opacity: 1;
    animation: fadeOut 0.5s forwards;
  }
  @keyframes fadeIn {
    to { opacity: 1; }
  }
  @keyframes fadeOut {
    to { opacity: 0; }
  }
  .btn:hover {
    background-color: #007bff !important;
    transform: scale(1.1) !important;
  }
  
  .btn {
    transition: transform 0.2s ease, background-color 0.3s ease;
  }
`;
document.head.appendChild(style);
