import { Libro } from "../entidades/libro";
import Swal from "sweetalert2";
import { renderLibrosPage } from "../paginas/libros"; // Importamos la función para renderizar los libros

export const renderLibroForm = (
  onSubmit: (libro: Partial<Libro>) => Promise<void>, // onSubmit es una función async
  initialData: Partial<Libro> = {}
): HTMLElement => {
  const form = document.createElement("form");
  form.className = "bg-white p-8 rounded-lg shadow-lg space-y-6";

  form.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <label class="block">
        <span class="text-gray-700">Código:</span>
        <input type="text" name="codigo" value="${initialData.codigo || ""}" required class="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
      </label>
      <label class="block">
        <span class="text-gray-700">Tipo:</span>
        <select name="tipo" class="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="Libro" ${initialData.tipo === "Libro" ? "selected" : ""}>Libro</option>
          <option value="Revista" ${initialData.tipo === "Revista" ? "selected" : ""}>Revista</option>
        </select>
      </label>
      <label class="block">
        <span class="text-gray-700">Categoría:</span>
        <select name="categoria_id" class="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="1" ${initialData.categoria_id === 1 ? "selected" : ""}>Literatura</option>
          <option value="2" ${initialData.categoria_id === 2 ? "selected" : ""}>Salud</option>
          <option value="3" ${initialData.categoria_id === 3 ? "selected" : ""}>Informática</option>
          <option value="4" ${initialData.categoria_id === 4 ? "selected" : ""}>Erótico</option>
        </select>
      </label>
      <label class="block">
        <span class="text-gray-700">Editorial:</span>
        <input type="text" name="editorial" value="${initialData.editorial || ""}" class="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
      </label>
      <label class="block">
        <span class="text-gray-700">Nombre:</span>
        <input type="text" name="nombre" value="${initialData.nombre || ""}" required class="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
      </label>
      <label class="block">
        <span class="text-gray-700">Autor:</span>
        <input type="text" name="autor" value="${initialData.autor || ""}" class="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
      </label>
      <label class="block">
        <span class="text-gray-700">Año Publicación:</span>
        <input type="number" name="anio_publicacion" value="${initialData.anio_publicacion || ""}" class="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
      </label>
    </div>
    <button type="submit" class="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">Guardar</button>
    <button type="button" class="w-full bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 mt-2" onclick="form.reset()">Cancelar</button>
    <button type="button" class="w-full bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 mt-2" id="close-button">Cerrar</button>
  `;

  // Manejar el evento de "submit" del formulario
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const libro = Object.fromEntries(formData.entries()) as Partial<Libro>;

  try {
    console.log("Guardando libro...", libro); // Depuración
    await onSubmit(libro); // Ejecuta la función para guardar el libro
    console.log("Libro guardado exitosamente."); // Depuración
    await navigateToLibrosSection(); 
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
    navigateToLibrosSection(); // Navegar a la sección de libros al cerrar
  });

  // Función para navegar a la sección de "Libros"
  const navigateToLibrosSection = async () => {
    const librosContainer = document.getElementById("libros-container");
    if (librosContainer) {
      librosContainer.innerHTML = ""; // Limpiar el contenedor
      console.log("Renderizando la página de libros..."); // Depuración
      const librosPage = await renderLibrosPage(); // Renderizar la página de libros
      librosContainer.appendChild(librosPage);

      // Asegurarnos de mostrar la sección de libros
      librosContainer.classList.remove("hidden");
      librosContainer.classList.add("animate__animated", "animate__fadeInUp");

      // Ocultar otras secciones si es necesario
      const estudiantesContainer = document.getElementById("estudiantes-container");
      const prestamosContainer = document.getElementById("prestamos-container");
      estudiantesContainer?.classList.add("hidden");
      prestamosContainer?.classList.add("hidden");
    } else {
      console.error("No se encontró el contenedor de libros."); // Depuración
    }
  };

  return form;
};