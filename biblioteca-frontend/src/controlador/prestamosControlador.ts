import { Prestamo } from "../entidades/prestamo";
import axios from "axios";

const API_URL = "http://localhost:5000/api/prestamos";

export const fetchPrestamos = async (): Promise<Prestamo[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createPrestamo = async (prestamo: Partial<Prestamo>): Promise<Prestamo> => {
  try {
    const response = await axios.post(API_URL, prestamo);
    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Error al realizar el préstamo");
  }
};

export const updateDevolucion = async (prestamoId: number, fechaDevolucion: string): Promise<void> => {
  const response = await axios.put(`http://localhost:5000/api/prestamos/${prestamoId}/devolucion`, {
    fecha_devolucion: fechaDevolucion,
  });
  if (response.status !== 200) {
    throw new Error(response.data.message || "Error al registrar la devolución");
  }
};



export const devolverLibro = async (prestamoId: number, fechaDevolucion: string) => {
  const response = await axios.put(`${API_URL}/${prestamoId}/devolver`, {
    fecha_devolucion: fechaDevolucion,
  });
  return response.data; 
};

