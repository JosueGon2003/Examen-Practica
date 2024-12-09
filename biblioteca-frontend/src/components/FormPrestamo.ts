import { Estudiante } from "../entidades/estudiante";
import { Libro } from "../entidades/libro";
import Swal from "sweetalert2";
import { renderPrestamosPage } from "../paginas/prestamos";

// Función para navegar a la sección de "Préstamos"
const navigateToPrestamosSection = async () => {
  const prestamosContainer = document.getElementById("prestamos-container");
  if (prestamosContainer) {
    prestamosContainer.innerHTML = ""; // Limpiar el contenedor
    console.log("Renderizando la página de préstamos..."); // Depuración
    const prestamosPage = await renderPrestamosPage(); // Renderizar la página de préstamos
    prestamosContainer.appendChild(prestamosPage);

    // Asegurarnos de mostrar la sección de préstamos
    prestamosContainer.classList.remove("hidden");
    prestamosContainer.classList.add("animate__animated", "animate__fadeInUp");

    // Ocultar otras secciones si es necesario
    const estudiantesContainer = document.getElementById("estudiantes-container");
    const librosContainer = document.getElementById("libros-container");
    estudiantesContainer?.classList.add("hidden");
    librosContainer?.classList.add("hidden");
  } else {
    console.error("No se encontró el contenedor de préstamos."); // Depuración
  }
};

// Renderiza el formulario de préstamo de libros
export const renderPrestamoForm = (
  estudiantes: Estudiante[],
  libros: Libro[],
  onSubmit: (prestamo: { estudiante_id: number; libros_ids: number[]; fecha_prestamo: string; fecha_entrega: string }) => void
): HTMLElement => {
  const availableLibros = libros.filter((lib) => lib.disponible);
  let selectedLibros: Libro[] = [];

  const form = document.createElement("div");
  form.className = "bg-white p-8 rounded-lg shadow-lg space-y-6";

  const formHTML = 
    `<h2 class="text-xl font-bold mb-4">Realizar Préstamo</h2>
    <form class="space-y-4">
      <label class="block">
        Estudiante:
        <select name="estudiante_id" required class="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          ${estudiantes.map((est) => `<option value="${est.id}">${est.nombre} ${est.apellido}</option>`).join('')}
        </select>
      </label>
      <label class="block">
        Libros Seleccionados: 
        <span id="libros-seleccionados" class="font-medium">Ninguno</span>
        <button type="button" id="seleccionar-libros-btn" class="mt-1 block w-full p-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500">Seleccionar Libros</button>
      </label>
      <label class="block">
        Fecha de Préstamo:
        <input type="date" name="fecha_prestamo" required class="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
      </label>
      <label class="block">
        Fecha de Entrega:
        <input type="date" name="fecha_entrega" required class="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
      </label>
      <button type="submit" class="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">Guardar Préstamo</button>
      <button type="button" id="cancelar-btn" class="w-full bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 mt-2">Cancelar</button>
      <button type="button" id="cerrar-btn" class="w-full bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 mt-2">Cerrar</button>
    </form>`;

  form.innerHTML = formHTML;

  const seleccionarLibrosBtn = form.querySelector("#seleccionar-libros-btn") as HTMLButtonElement;
  const cancelarBtn = form.querySelector("#cancelar-btn") as HTMLButtonElement;
  const cerrarBtn = form.querySelector("#cerrar-btn") as HTMLButtonElement;

  seleccionarLibrosBtn.addEventListener("click", () => {
    openLibrosModal(availableLibros, (librosSeleccionados) => {
      selectedLibros = librosSeleccionados;
      const selectedBooksNames = selectedLibros.map((libro) => libro.nombre).join(', ');
      form.querySelector("#libros-seleccionados")!.textContent = selectedBooksNames || "Ninguno";
    });
  });

  cancelarBtn.addEventListener("click", () => {
    form.querySelector("form")?.reset();
    form.querySelector("#libros-seleccionados")!.textContent = "Ninguno";
  });

  cerrarBtn.addEventListener("click", () => {
    form.parentNode?.removeChild(form);  // Cierra el formulario y lo elimina del DOM
    navigateToPrestamosSection();  // Redirige a la página de préstamos
  });

  form.querySelector("form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const estudiante_id = Number(formData.get("estudiante_id"));
    const fecha_prestamo = formData.get("fecha_prestamo") as string;
    const fecha_entrega = formData.get("fecha_entrega") as string;

    if (selectedLibros.length === 0) {
      alert("Debe seleccionar al menos un libro.");
      return;
    }

    const libros_ids = selectedLibros.map((libro) => libro.id);

    // Ejecuta la función de onSubmit para guardar el préstamo
    onSubmit({ estudiante_id, libros_ids, fecha_prestamo, fecha_entrega });

    Swal.fire({
      title: "¡Éxito!",
      text: "El préstamo se realizó correctamente.",
      icon: "success",
      confirmButtonText: "OK"
    });

    form.parentNode?.removeChild(form);  // Cierra el formulario tras guardar
    navigateToPrestamosSection();  // Redirige a la página de préstamos
  });

  return form;
};

// Función para abrir el modal de selección de libros
function openLibrosModal(libros: Libro[], onConfirm: (librosSeleccionados: Libro[]) => void): void {
  // Crear el modal
  const modal = document.createElement("div");
  modal.className = "fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50";

  const modalContent = document.createElement("div");
  modalContent.className = "bg-white p-6 rounded-lg shadow-lg w-full max-w-lg";

  const closeButton = document.createElement("button");
  closeButton.textContent = "Cerrar";
  closeButton.className = "w-full bg-gray-500 text-white py-3 px-6 rounded-lg mt-2 hover:bg-gray-600";
  closeButton.addEventListener("click", () => {
    document.body.removeChild(modal);
  });

  const table = document.createElement("table");
  table.className = "w-full table-auto border-collapse";
  table.innerHTML = `
    <thead class="bg-gray-100">
      <tr>
        <th class="p-2 text-left">Seleccionar</th>
        <th class="p-2 text-left">Libro</th>
        <th class="p-2 text-left">Autor</th>
      </tr>
    </thead>
    <tbody>
      ${libros
        .map(
          (libro) =>
            `<tr class="hover:bg-gray-100">
              <td class="p-2"><input type="checkbox" value="${libro.id}" /></td>
              <td class="p-2">${libro.nombre}</td>
              <td class="p-2">${libro.autor}</td>
            </tr>`
        )
        .join("")}
    </tbody>`;

  const confirmButton = document.createElement("button");
  confirmButton.textContent = "Confirmar Selección";
  confirmButton.className = "w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 mt-4";
  confirmButton.addEventListener("click", () => {
    const selectedRows = Array.from(table.querySelectorAll("input[type='checkbox']:checked")) as HTMLInputElement[];
    const selectedLibros = selectedRows.map((checkbox) => {
      const libroId = Number(checkbox.value);
      return libros.find((libro) => libro.id === libroId)!;
    });

    onConfirm(selectedLibros);
    document.body.removeChild(modal);
  });

  modalContent.appendChild(closeButton);
  modalContent.appendChild(table);
  modalContent.appendChild(confirmButton);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
}
