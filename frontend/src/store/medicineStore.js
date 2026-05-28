import { create } from 'zustand';
import api from '../utils/api';

const useMedicineStore = create((set) => ({
  medicines: [],
  isLoading: false,
  error: null,

  fetchMedicines: async (keyword = '') => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get(`/medicines?keyword=${keyword}`);
      set({ medicines: data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
    }
  },

  addMedicine: async (medicineData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/medicines', medicineData);
      set((state) => ({ medicines: [data, ...state.medicines], isLoading: false }));
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
      return false;
    }
  },

  updateMedicine: async (id, medicineData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.put(`/medicines/${id}`, medicineData);
      set((state) => ({
        medicines: state.medicines.map((m) => (m._id === id ? data : m)),
        isLoading: false,
      }));
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
      return false;
    }
  },

  deleteMedicine: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/medicines/${id}`);
      set((state) => ({
        medicines: state.medicines.filter((m) => m._id !== id),
        isLoading: false,
      }));
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
      return false;
    }
  },
}));

export default useMedicineStore;
