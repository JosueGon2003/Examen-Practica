import { Estudiante } from "../entidades/estudiante";
import Swal from "sweetalert2";
import { renderEstudiantesPage } from "../paginas/estudiantes";

// Renderiza el formulario de estudiante para registro o edición
export const renderEstudianteForm = (
  onSubmit: (estudiante: Partial<Estudiante>) => void,
  initialData: Partial<Estudiante> = {}
): HTMLElement => {
  const form = document.createElement("div");
  form.className = "bg-white p-8 rounded-lg shadow-lg space-y-6";

  const formHTML = `
    <form>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label class="block">
          <span class="text-gray-700">Cédula:</span>
          <input type="text" name="cedula" value="${initialData.cedula || ""}" required class="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </label>
        <label class="block">
          <span class="text-gray-700">Nombre:</span>
          <input type="text" name="nombre" value="${initialData.nombre || ""}" required class="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </label>
        <label class="block">
          <span class="text-gray-700">Apellido:</span>
          <input type="text" name="apellido" value="${initialData.apellido || ""}" required class="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </label>
        <label class="block">
          <span class="text-gray-700">Sexo:</span>
          <select name="sexo" class="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="M" ${initialData.sexo === "M" ? "selected" : ""}>Masculino</option>
            <option value="F" ${initialData.sexo === "F" ? "selected" : ""}>Femenino</option>
          </select>
        </label>
        <label class="block">
          <span class="text-gray-700">Fecha de Nacimiento:</span>
          <input type="date" name="fecha_nacimiento" value="${initialData.fecha_nacimiento ? new Date(initialData.fecha_nacimiento).toISOString().split('T')[0] : ''}" required class="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </label>
      </div>
      <div class="flex flex-col gap-4 mt-6">
        <button type="submit" class="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">Guardar</button>
        <button type="button" class="w-full bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500" onclick="form.reset()">Cancelar</button>
        <button type="button" class="w-full bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 mt-2" id="close-button">Cerrar</button>
      </div>
    </form>
  `;

  form.innerHTML = formHTML;

  // Evento de submit
  form.querySelector("form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const estudiante = Object.fromEntries(formData.entries()) as Partial<Estudiante>;

    try {
      console.log("Guardando libro...", estudiante); // Depuración
      await onSubmit(estudiante); // Ejecuta la función para guardar el libro
      console.log("Libro guardado exitosamente."); // Depuración
      await navigateToEstudiantesSection(); 
    } catch (error) {
      console.error("Error al guardar el libro:", error); // Depuración
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al guardar el libro.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  });

  // Manejar el botón de cerrar
  const closeButton = form.querySelector("#close-button");
  closeButton?.addEventListener("click", () => {
    form.parentNode?.removeChild(form);
    navigateToEstudiantesSection(); // Navegar a la sección de libros al cerrar
  });


  // Función para navegar a la sección de "Estudiantes"
  const navigateToEstudiantesSection = async () => {
    const estudiantesContainer = document.getElementById("estudiantes-container");
    if (estudiantesContainer) {
      estudiantesContainer.innerHTML = ""; // Limpiar el contenedor
      console.log("Renderizando la página de estudiantes..."); // Depuración
      const estudiantesPage = await renderEstudiantesPage(); // Renderizar la página de estudiantes
      estudiantesContainer.appendChild(estudiantesPage);

      // Asegurarnos de mostrar la sección de estudiantes
      estudiantesContainer.classList.remove("hidden");
      estudiantesContainer.classList.add("animate__animated", "animate__fadeInUp");

      // Ocultar otras secciones si es necesario
      const librosContainer = document.getElementById("libros-container");
      const prestamosContainer = document.getElementById("prestamos-container");
      librosContainer?.classList.add("hidden");
      prestamosContainer?.classList.add("hidden");
    } else {
      console.error("No se encontró el contenedor de estudiantes."); // Depuración
    }
  };

  return form;
};
