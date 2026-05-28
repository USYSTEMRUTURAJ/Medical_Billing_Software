import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] bg-white rounded-2xl shadow-sm border border-gray-100">
      <SettingsIcon className="w-24 h-24 text-gray-300 mb-4" />
      <h2 className="text-2xl font-bold text-gray-700">Settings Module</h2>
      <p className="text-gray-500 mt-2">Coming soon...</p>
    </div>
  );
};

export default Settings;
