import { create } from 'zustand';
import api from '../utils/api';

const useSupplierStore = create((set) => ({
  suppliers: [],
  isLoading: false,
  error: null,

  fetchSuppliers: async (keyword = '') => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get(`/suppliers?keyword=${keyword}`);
      set({ suppliers: data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
    }
  },

  addSupplier: async (supplierData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/suppliers', supplierData);
      set((state) => ({ suppliers: [data, ...state.suppliers], isLoading: false }));
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
      return false;
    }
  },

  updateSupplier: async (id, supplierData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.put(`/suppliers/${id}`, supplierData);
      set((state) => ({
        suppliers: state.suppliers.map((s) => (s._id === id ? data : s)),
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

  deleteSupplier: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/suppliers/${id}`);
      set((state) => ({
        suppliers: state.suppliers.filter((s) => s._id !== id),
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

export default useSupplierStore;
