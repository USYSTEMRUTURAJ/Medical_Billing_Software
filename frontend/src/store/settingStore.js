import { create } from 'zustand';
import api from '../utils/api';

const useSettingStore = create((set) => ({
  settings: null,
  isLoading: false,
  error: null,

  fetchSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get('/settings');
      set({ settings: data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
    }
  },

  updateSettings: async (settingsData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.put('/settings', settingsData);
      set({ settings: data, isLoading: false });
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

export default useSettingStore;
