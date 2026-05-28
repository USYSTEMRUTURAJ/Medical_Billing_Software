import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import useStaffStore from '../store/staffStore';
import toast from 'react-hot-toast';

const StaffModal = ({ isOpen, onClose, staffMember }) => {
  const { addStaff, updateStaff, isLoading } = useStaffStore();
  const isEditing = !!staffMember;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Cashier',
    isActive: true,
  });

  useEffect(() => {
    if (staffMember) {
      setFormData({
        name: staffMember.name,
        email: staffMember.email,
        password: '',
        role: staffMember.role,
        isActive: staffMember.isActive !== undefined ? staffMember.isActive : true,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'Cashier',
        isActive: true,
      });
    }
  }, [staffMember]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'isActive' ? value === 'true' : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('Name and Email are required');
      return;
    }

    if (!isEditing && !formData.password) {
      toast.error('Password is required for new staff');
      return;
    }

    let result;
    if (isEditing) {
      // If editing and password is empty, don't send it to backend
      const dataToSubmit = { ...formData };
      if (!dataToSubmit.password) delete dataToSubmit.password;
      result = await updateStaff(staffMember._id, dataToSubmit);
    } else {
      result = await addStaff(formData);
    }

    if (result.success) {
      toast.success(isEditing ? 'Staff updated successfully' : 'Staff added successfully');
      onClose();
    } else {
      toast.error(result.error || 'Failed to save staff information');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">
            {isEditing ? 'Edit Staff Member' : 'Add New Staff'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="staffForm" onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50"
                placeholder="e.g. Ramesh Kumar"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50"
                placeholder="e.g. ramesh@pharmacy.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-medium">
                {isEditing ? 'New Password (Leave blank to keep current)' : 'Password *'}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required={!isEditing}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50"
                placeholder="Min 6 characters"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50"
              >
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Pharmacist">Pharmacist</option>
                <option value="Cashier">Cashier</option>
              </select>
            </div>

            {isEditing && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Status</label>
                <select
                  name="isActive"
                  value={formData.isActive ? 'true' : 'false'}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50"
                >
                  <option value="true">Active</option>
                  <option value="false">Disabled</option>
                </select>
              </div>
            )}
          </form>
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-medium text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="staffForm"
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-md shadow-primary-500/20 disabled:opacity-70 flex items-center"
          >
            {isLoading ? 'Saving...' : 'Save Staff'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffModal;
