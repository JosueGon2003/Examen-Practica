import api from '../utils/api';

export const registrarDevolucion = async (
    prestamoId: number,
    fechaDevolucion: string
): Promise<void> => {
    await api.put(`/devoluciones/${prestamoId}`, { fechaDevolucion });
};