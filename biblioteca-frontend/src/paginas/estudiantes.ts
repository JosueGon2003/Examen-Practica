import 'bootstrap/dist/css/bootstrap.min.css';
import { fetchEstudiantes, createEstudiante, updateEstudiante, deleteEstudiante } from "../controlador/estudiantesControlador";
import { renderEstudianteForm } from "../components/FormEstudiante";
import Swal from "sweetalert2";

// Renderiza la página de estudiantes con diseño profesional y animaciones
export const renderEstudiantesPage = async (): Promise<HTMLElement> => {
  const container = document.createElement("div");
  container.className = "p-6 bg-white rounded-lg shadow-lg max-w-7xl mx-auto";

  // Botón para agregar un nuevo estudiante
  const btnAgregar = document.createElement("button");
  btnAgregar.className = "btn btn-primary mb-4 w-100 w-sm-auto";
  btnAgregar.textContent = "Registrar Estudiante";
  btnAgregar.addEventListener("click", async () => {
    const form = renderEstudianteForm(async (nuevoEstudiante) => {
      await createEstudiante(nuevoEstudiante);
      Swal.fire({
        title: "¡Éxito!",
        text: "El estudiante se registró correctamente.",
        icon: "success",
        showConfirmButton: true,
        confirmButtonColor: "#007bff" // Color del botón de OK
      }).then(async () => {
        const estudiantesPage = await renderEstudiantesPage(); // Renderiza nuevamente la tabla
        container.innerHTML = ""; // Limpia el contenedor
        container.appendChild(estudiantesPage); // Muestra la tabla actualizada
      });
    });

    // Animación de transición al cambiar el formulario
    container.classList.add("fade-out");
    setTimeout(() => {
      container.innerHTML = ""; // Limpiar el contenedor antes de mostrar el formulario
      container.classList.remove("fade-out");
      container.appendChild(form);
    }, 300); // Ajustar el tiempo de la animación
  });

  container.appendChild(btnAgregar);

  // Tabla de estudiantes con scroll responsivo
  const estudiantes = await fetchEstudiantes();
  const table = document.createElement("table");
  table.className = "table table-bordered table-responsive-lg";
  table.style.maxHeight = "500px"; // Ajustar la altura según sea necesario
  table.innerHTML = `
    <thead class="thead-dark">
      <tr>
        <th>ID</th>
        <th>Cédula</th>
        <th>Nombre</th>
        <th>Apellido</th>
        <th>Sexo</th>
        <th>Fecha de Nacimiento</th>
        <th>Sancionado</th>
        <th>Sanción Hasta</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
  ${estudiantes.map(estudiante => {
    const fechaNacimiento = new Date(estudiante.fecha_nacimiento).toLocaleDateString('es-ES');
    const sancionHasta = estudiante.sancionado && estudiante.sancion_hasta
      ? new Date(estudiante.sancion_hasta).toLocaleDateString('es-ES')
      : "N/A";

    return `
      <tr>
        <td>${estudiante.id}</td>
        <td>${estudiante.cedula}</td>
        <td>${estudiante.nombre}</td>
        <td>${estudiante.apellido}</td>
        <td>${estudiante.sexo}</td>
        <td>${fechaNacimiento}</td>
        <td>${estudiante.sancionado ? "Sí" : "No"}</td>
        <td>${sancionHasta}</td>
        <td>
          <div class="d-flex justify-content-center">
            <button class="btn btn-warning btn-sm mx-1 edit-btn" data-id="${estudiante.id}">Modificar</button>
            <button class="btn btn-danger btn-sm mx-1 delete-btn" data-id="${estudiante.id}">Eliminar</button>
          </div>
        </td>
      </tr>`;
  }).join('')}
</tbody>
`;

  container.appendChild(table);

  // Funcionalidad de los botones de edición con animación
  table.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", async () => {
      const id = parseInt((button as HTMLButtonElement).dataset.id || "0");
      const estudiante = estudiantes.find((e) => e.id === id);
      if (!estudiante) return;

      const form = renderEstudianteForm(async (updatedEstudiante) => {
        await updateEstudiante(id, updatedEstudiante);
        Swal.fire({
          title: "¡Éxito!",
          text: "El estudiante fue actualizado correctamente.",
          icon: "success",
          showConfirmButton: true,
          confirmButtonColor: "#007bff" // Color del botón de OK
        }).then(async () => {
          const estudiantesPage = await renderEstudiantesPage(); // Renderiza nuevamente la tabla
          container.innerHTML = ""; // Limpia el contenedor
          container.appendChild(estudiantesPage); // Muestra la tabla actualizada
        });
      }, estudiante);

      // Animación de transición al cambiar el formulario
      container.classList.add("fade-out");
      setTimeout(() => {
        container.innerHTML = ""; // Limpiar el contenedor antes de mostrar el formulario
        container.classList.remove("fade-out");
        container.appendChild(form);
      }, 300); // Ajustar el tiempo de la animación
    });
  });

  // Funcionalidad de los botones de eliminación con animación
  table.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", async () => {
      const id = parseInt((button as HTMLButtonElement).dataset.id || "0");

      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#dc3545" // Color del botón de confirmar
      });

      if (result.isConfirmed) {
        await deleteEstudiante(id);
        Swal.fire({
          title: "¡Eliminado!",
          text: "El estudiante fue eliminado exitosamente.",
          icon: "success",
          showConfirmButton: true,
          confirmButtonColor: "#007bff" // Color del botón de OK
        }).then(async () => {
          const estudiantesPage = await renderEstudiantesPage(); // Renderiza nuevamente la tabla
          container.innerHTML = ""; // Limpia el contenedor
          container.appendChild(estudiantesPage); // Muestra la tabla actualizada
        });
      }
    });
  });

  return container;
};

// Animación de desaparición para el contenedor
const style = document.createElement('style');
style.textContent = `
  .fade-out {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }
`;
document.head.appendChild(style);
