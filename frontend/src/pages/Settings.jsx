import { useEffect, useState } from 'react';
import { Save, Settings as SettingsIcon } from 'lucide-react';
import useSettingStore from '../store/settingStore';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const Settings = () => {
  const { settings, fetchSettings, updateSettings, isLoading } = useSettingStore();
  const { userInfo } = useAuthStore();
  
  const [formData, setFormData] = useState({
    shopName: '',
    address: '',
    phone: '',
    email: '',
    gstNumber: '',
  });

  const isAdmin = userInfo?.role === 'Admin';

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (settings) {
      setFormData({
        shopName: settings.shopName || '',
        address: settings.address || '',
        phone: settings.phone || '',
        email: settings.email || '',
        gstNumber: settings.gstNumber || '',
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      toast.error('Only Admin is authorized to change settings');
      return;
    }

    const success = await updateSettings(formData);
    if (success) {
      toast.success('Settings updated successfully');
    } else {
      toast.error('Failed to update settings');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">System Settings</h1>
        <p className="text-gray-500 mt-1">Configure your pharmacy profile and billing details</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
          <div className="bg-primary-100 p-2 rounded-xl text-primary-600">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800 font-semibold">Pharmacy Information</h2>
            <p className="text-xs text-gray-500">These details will appear on printed invoices</p>
          </div>
        </div>

        <div className="p-6">
          {isLoading && !settings ? (
            <div className="text-center py-8 text-gray-500">Loading settings...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pharmacy / Shop Name *</label>
                  <input
                    type="text"
                    name="shopName"
                    value={formData.shopName}
                    onChange={handleChange}
                    disabled={!isAdmin}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50 disabled:opacity-75 disabled:cursor-not-allowed"
                    placeholder="e.g. PharmaPro Pharmacy"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isAdmin}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50 disabled:opacity-75 disabled:cursor-not-allowed"
                    placeholder="e.g. +91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isAdmin}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50 disabled:opacity-75 disabled:cursor-not-allowed"
                    placeholder="e.g. contact@pharmapro.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GSTIN / Tax Number</label>
                  <input
                    type="text"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleChange}
                    disabled={!isAdmin}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50 disabled:opacity-75 disabled:cursor-not-allowed"
                    placeholder="e.g. 27AAAAA0000A1Z5"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shop Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isAdmin}
                    rows="3"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50 disabled:opacity-75 disabled:cursor-not-allowed"
                    placeholder="e.g. 123 Health Street, Medical District, Mumbai"
                  />
                </div>
              </div>

              {isAdmin && (
                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-md shadow-primary-500/20 disabled:opacity-70"
                  >
                    <Save className="w-5 h-5" />
                    {isLoading ? 'Saving Changes...' : 'Save Settings'}
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
