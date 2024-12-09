import axios from "axios";
import { Libro } from "../entidades/libro";

const API_URL = "http://localhost:5000/api/libros";

export const fetchLibros = async (): Promise<Libro[]> => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createLibro = async (libro: Partial<Libro>): Promise<Libro> => {
    const response = await axios.post(API_URL, libro);
    return response.data;
};

// Actualizar un libro existente
export const updateLibro = async (id: number, libro: Partial<Libro>): Promise<Libro> => {
    const response = await axios.put(`${API_URL}/${id}`, libro);
    return response.data;
  };
  
  // Eliminar un libro
  export const deleteLibro = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  };