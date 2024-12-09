import Swal from "sweetalert2";
export const openDevolucionModal = (
  prestamoId: number,
  onConfirm: (fechaDevolucion: string) => void
): HTMLElement => {
  const modal = document.createElement("div");
  modal.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate__animated animate__fadeIn animate__faster";

  const modalContent = document.createElement("div");
  modalContent.className = "bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl mx-6 transform scale-95 animate__animated animate__zoomIn animate__faster transition-all";

  modalContent.innerHTML = `
    <div class="text-center">
      <h2 class="text-3xl font-extrabold text-gray-800 mb-4">Registrar Devolución</h2>
      <p class="text-xl text-gray-500 mb-8">ID del Préstamo: <span class="font-semibold">${prestamoId}</span></p>
      <div class="mb-6">
        <label for="fecha-devolucion" class="block text-lg font-medium text-gray-700 mb-2">Fecha de Devolución:</label>
        <input type="date" id="fecha-devolucion" required class="block w-full px-5 py-3 text-lg border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"/>
      </div>
      <div class="flex justify-between gap-4">
        <button id="confirmar-btn" class="w-1/2 bg-green-600 text-white py-3 px-6 rounded-lg text-xl font-semibold transition-all duration-300 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 hover:scale-105 transform">
          Confirmar
        </button>
        <button id="cancelar-btn" class="w-1/2 bg-gray-600 text-white py-3 px-6 rounded-lg text-xl font-semibold transition-all duration-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 hover:scale-105 transform">
          Cancelar
        </button>
      </div>
    </div>
  `;

  // Confirmar acción
  modalContent.querySelector("#confirmar-btn")?.addEventListener("click", () => {
    const fechaDevolucion = (modalContent.querySelector("#fecha-devolucion") as HTMLInputElement)?.value;
    if (!fechaDevolucion) {
      Swal.fire({
        title: "Error",
        text: "Por favor, selecciona una fecha de devolución.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
      });
      return;
    }
    onConfirm(fechaDevolucion);
    // Animación de cierre con un retraso
    modal.classList.add("animate__fadeOut", "animate__zoomOut");
    modalContent.addEventListener('animationend', () => {
      document.body.removeChild(modal);  // Cerrar después de completar la animación
    });
  });

  // Cancelar acción
  modalContent.querySelector("#cancelar-btn")?.addEventListener("click", () => {
    // Animación de cierre con un retraso
    modal.classList.add("animate__fadeOut", "animate__zoomOut");
    modalContent.addEventListener('animationend', () => {
      document.body.removeChild(modal);  // Cerrar después de completar la animación
    });
  });

  // Asegurarse de que la animación de entrada se complete antes de permitir interacción
  modalContent.addEventListener('animationend', () => {
    // Esto garantiza que el modal quede completamente visible antes de permitir interacción
    modalContent.classList.remove("animate__zoomIn");
  });

  modal.appendChild(modalContent);
  return modal;
};
