import 'bootstrap/dist/css/bootstrap.min.css';
import { fetchLibros, createLibro, updateLibro, deleteLibro } from "../controlador/librosControlador";
import { renderLibroForm } from "../components/FormLibro";
import Swal from "sweetalert2";

// Mapea las categorías por su ID
const mapCategoria = (categoria_id: number): string => {
  switch (categoria_id) {
    case 1: return "Literatura";
    case 2: return "Salud";
    case 3: return "Informática";
    case 4: return "Erótico";
    default: return "Desconocido";
  }
};

// Renderiza la página de libros con animación y diseño profesional
export const renderLibrosPage = async (): Promise<HTMLElement> => {
  const container = document.createElement("div");
  container.className = "p-6 bg-white rounded-lg shadow-lg max-w-7xl mx-auto";

  // Botón para agregar un nuevo libro
  const btnAgregar = document.createElement("button");
  btnAgregar.className = "btn btn-primary mb-4 w-100 w-sm-auto";
  btnAgregar.textContent = "Agregar Libro";
  btnAgregar.addEventListener("click", async () => {
    const form = renderLibroForm(async (nuevoLibro) => {
      await createLibro(nuevoLibro);
      Swal.fire({
        title: "¡Éxito!",
        text: "El libro se creó correctamente.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#007bff" // Color del botón de OK
      }).then(async () => {
        const librosPage = await renderLibrosPage();
        container.innerHTML = ""; // Limpia el contenedor
        container.appendChild(librosPage); // Muestra la tabla actualizada
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

  // Tabla de libros con scroll responsivo
  const libros = await fetchLibros();
  const table = document.createElement("table");
  table.className = "table table-bordered table-responsive-lg";
  table.style.maxHeight = "500px"; // Ajustar la altura según sea necesario
  table.innerHTML = `
    <thead class="thead-dark">
      <tr>
        <th>ID</th>
        <th>Código</th>
        <th>Tipo</th>
        <th>Categoría</th>
        <th>Editorial</th>
        <th>Nombre</th>
        <th>Autor</th>
        <th>Año de Publicación</th>
        <th>Disponible</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      ${libros.map(libro =>
        `<tr>
          <td>${libro.id}</td>
          <td>${libro.codigo}</td>
          <td>${libro.tipo}</td>
          <td>${mapCategoria(libro.categoria_id)}</td>
          <td>${libro.editorial}</td>
          <td>${libro.nombre}</td>
          <td>${libro.autor}</td>
          <td>${libro.anio_publicacion}</td>
          <td>${libro.disponible ? "Sí" : "No"}</td>
          <td>
            <div class="d-flex justify-content-center">
              <button class="btn btn-warning btn-sm mx-1 edit-btn" data-id="${libro.id}">Modificar</button>
              <button class="btn btn-danger btn-sm mx-1 delete-btn" data-id="${libro.id}">Eliminar</button>
            </div>
          </td>
        </tr>`).join('')}
    </tbody>`;

  container.appendChild(table);

  // Funcionalidad de los botones de edición con animación
  table.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", async () => {
      const id = parseInt((button as HTMLButtonElement).dataset.id || "0");
      const libro = libros.find((l) => l.id === id);
      if (!libro) return;

      const form = renderLibroForm(async (updatedLibro) => {
        await updateLibro(id, updatedLibro);
        Swal.fire({
          title: "¡Éxito!",
          text: "El libro fue actualizado correctamente.",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#007bff" // Color del botón de OK
        }).then(async () => {
          const librosPage = await renderLibrosPage(); // Renderiza nuevamente la tabla
          container.innerHTML = ""; // Limpia el contenedor
          container.appendChild(librosPage); // Muestra la tabla actualizada
        });
      }, libro);

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
        await deleteLibro(id);
        Swal.fire({
          title: "¡Eliminado!",
          text: "El libro fue eliminado exitosamente.",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#007bff" // Color del botón de OK
        }).then(async () => {
          const librosPage = await renderLibrosPage(); // Renderiza nuevamente la tabla
          container.innerHTML = ""; // Limpia el contenedor
          container.appendChild(librosPage); // Muestra la tabla actualizada
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
