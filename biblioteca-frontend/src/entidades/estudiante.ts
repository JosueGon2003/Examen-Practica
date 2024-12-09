export interface Estudiante {
    id: number;
    cedula: string;
    nombre: string;
    apellido: string;
    sexo: string;
    fecha_nacimiento: string;
    sancionado: boolean;
    sancion_hasta?: string; // Propiedad opcional que almacena la fecha de finalización de la sanción
  }
  