import { renderLibrosPage } from "../src/paginas/libros";
import { renderEstudiantesPage } from "../src/paginas/estudiantes";
import { renderPrestamosPage } from "../src/paginas/prestamos";

const initializeApp = async () => {
  const estudiantesContainer = document.getElementById("estudiantes-container");
  const librosContainer = document.getElementById("libros-container");
  const prestamosContainer = document.getElementById("prestamos-container");
  const homeContainer = document.getElementById("home-container");
  const navbar = document.getElementById("navbar");

  // Botón de inicio
  const enterButton = document.getElementById("enter-button");

  // Configurar el botón "Comenzar"
  if (enterButton) {
    enterButton.addEventListener("click", () => {
      // Ocultar la pantalla de inicio con animación
      if (homeContainer) {
        homeContainer.classList.add("animate__animated", "animate__fadeOut");
        setTimeout(() => {
          homeContainer.classList.add("hidden");
          // Mostrar el navbar con animación
          if (navbar) {
            navbar.classList.remove("hidden");
            navbar.classList.add("animate__animated", "animate__fadeIn");
          }
        }, 1000); // Tiempo de espera para que termine la animación de salida
      }
    });
  }

  // Configurar botones de navegación
  const navEstudiantes = document.getElementById("nav-estudiantes");
  const navLibros = document.getElementById("nav-libros");
  const navPrestamos = document.getElementById("nav-prestamos");

  const closeMobileMenu = () => {
    const mobileMenu = document.getElementById("mobile-menu");
    if (mobileMenu) {
      mobileMenu.classList.remove("show"); // Bootstrap utiliza la clase "show" para los menús abiertos
    }
  };

  if (navEstudiantes) {
    navEstudiantes.addEventListener("click", async () => {
      showSection("estudiantes");
      if (estudiantesContainer) {
        estudiantesContainer.innerHTML = "";
        const estudiantesPage = await renderEstudiantesPage();
        estudiantesContainer.appendChild(estudiantesPage);
      }
      closeMobileMenu();
    });
  }

  if (navLibros) {
    navLibros.addEventListener("click", async () => {
      showSection("libros");
      if (librosContainer) {
        librosContainer.innerHTML = "";
        const librosPage = await renderLibrosPage();
        librosContainer.appendChild(librosPage);
      }
      closeMobileMenu();
    });
  }

  if (navPrestamos) {
    navPrestamos.addEventListener("click", async () => {
      showSection("prestamos");
      if (prestamosContainer) {
        prestamosContainer.innerHTML = "";
        const prestamosPage = await renderPrestamosPage();
        prestamosContainer.appendChild(prestamosPage);
      }
      closeMobileMenu();
    });
  }

  // Función para mostrar las secciones correspondientes con animación
  function showSection(section: string) {
    estudiantesContainer?.classList.add("hidden");
    librosContainer?.classList.add("hidden");
    prestamosContainer?.classList.add("hidden");

    switch (section) {
      case "estudiantes":
        estudiantesContainer?.classList.remove("hidden");
        estudiantesContainer?.classList.add("animate__animated", "animate__fadeInUp");
        break;
      case "libros":
        librosContainer?.classList.remove("hidden");
        librosContainer?.classList.add("animate__animated", "animate__fadeInUp");
        break;
      case "prestamos":
        prestamosContainer?.classList.remove("hidden");
        prestamosContainer?.classList.add("animate__animated", "animate__fadeInUp");
        break;
    }
  }
};

initializeApp();
