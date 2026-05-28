import { create } from 'zustand';
import api from '../utils/api';

const useStaffStore = create((set) => ({
  staffList: [],
  isLoading: false,
  error: null,

  fetchStaff: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get('/auth/users');
      set({ staffList: data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
    }
  },

  addStaff: async (staffData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/auth/register', staffData);
      set((state) => ({ staffList: [data, ...state.staffList], isLoading: false }));
      return { success: true };
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message;
      set({ error: errMsg, isLoading: false });
      return { success: false, error: errMsg };
    }
  },

  updateStaff: async (id, staffData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.put(`/auth/users/${id}`, staffData);
      set((state) => ({
        staffList: state.staffList.map((s) => (s._id === id ? { ...s, ...data } : s)),
        isLoading: false,
      }));
      return { success: true };
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message;
      set({ error: errMsg, isLoading: false });
      return { success: false, error: errMsg };
    }
  },

  deleteStaff: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/auth/users/${id}`);
      set((state) => ({
        staffList: state.staffList.filter((s) => s._id !== id),
        isLoading: false,
      }));
      return { success: true };
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message;
      set({ error: errMsg, isLoading: false });
      return { success: false, error: errMsg };
    }
  },
}));

export default useStaffStore;
