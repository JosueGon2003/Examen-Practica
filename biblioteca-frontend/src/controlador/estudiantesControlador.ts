import axios from 'axios';
import { Estudiante } from "../entidades/estudiante";


const API_URL = "http://localhost:5000/api/estudiantes";

export const fetchEstudiantes = async (): Promise<Estudiante[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createEstudiante = async (estudiante: Partial<Estudiante>): Promise<Estudiante> => {
  const response = await axios.post(API_URL, estudiante);
  return response.data;
};

export const updateEstudiante = async (
  id: number,
  estudiante: Partial<Estudiante>
): Promise<Estudiante> => {
  const response = await axios.put(`${API_URL}/${id}`, estudiante);
  return response.data;
};

export const deleteEstudiante = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};