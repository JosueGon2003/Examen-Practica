export interface Prestamo {
    id: number;
    estudiante_id: number;
    libro_id: number;
    fecha_prestamo: string;
    fecha_entrega: string;
    fecha_devolucion?: string;
    sancionado: boolean;
  }
  