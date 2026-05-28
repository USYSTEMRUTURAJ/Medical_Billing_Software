import { create } from 'zustand';
import api from '../utils/api';

const useCustomerStore = create((set) => ({
  customers: [],
  isLoading: false,
  error: null,

  fetchCustomers: async (keyword = '') => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get(`/customers?keyword=${keyword}`);
      set({ customers: data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
    }
  },

  addCustomer: async (customerData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/customers', customerData);
      set((state) => ({ customers: [data, ...state.customers], isLoading: false }));
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
      return false;
    }
  },

  updateCustomer: async (id, customerData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.put(`/customers/${id}`, customerData);
      set((state) => ({
        customers: state.customers.map((c) => (c._id === id ? data : c)),
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

  deleteCustomer: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/customers/${id}`);
      set((state) => ({
        customers: state.customers.filter((c) => c._id !== id),
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

export default useCustomerStore;
