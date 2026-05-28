import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, UserCog, UserCheck, ShieldAlert } from 'lucide-react';
import useStaffStore from '../store/staffStore';
import toast from 'react-hot-toast';
import StaffModal from '../components/StaffModal';
import useAuthStore from '../store/authStore';
import { Navigate } from 'react-router-dom';

const Staff = () => {
  const { staffList, fetchStaff, deleteStaff, isLoading } = useStaffStore();
  const { userInfo } = useAuthStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Safeguard: Only Admin can access Staff Management
  if (userInfo?.role !== 'Admin') {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleDelete = async (id) => {
    if (id === userInfo._id) {
      toast.error('You cannot delete your own admin account');
      return;
    }

    if (window.confirm('Are you sure you want to delete this staff member?')) {
      const result = await deleteStaff(id);
      if (result.success) {
        toast.success('Staff member deleted successfully');
      } else {
        toast.error(result.error || 'Failed to delete staff member');
      }
    }
  };

  const handleEdit = (staff) => {
    setSelectedStaff(staff);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedStaff(null);
    setIsModalOpen(true);
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-50 text-purple-700 border border-purple-100';
      case 'Manager':
        return 'bg-blue-50 text-blue-700 border border-blue-100';
      case 'Pharmacist':
        return 'bg-green-50 text-green-700 border border-green-100';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Staff Management</h1>
          <p className="text-gray-500 mt-1">Manage system user credentials, status and roles</p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-md shadow-primary-500/20"
        >
          <Plus className="w-5 h-5" />
          Add Staff
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 text-gray-700 uppercase font-semibold text-xs">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading && staffList.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">Loading staff accounts...</td>
                </tr>
              ) : staffList.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center justify-center py-6">
                      <UserCog className="w-12 h-12 text-gray-300 mb-2" />
                      <span>No staff members found.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                staffList.map((staff) => (
                  <tr key={staff._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {staff.name} {staff._id === userInfo._id && <span className="text-xs text-gray-400 font-normal ml-1">(You)</span>}
                    </td>
                    <td className="px-6 py-4">
                      {staff.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getRoleBadgeClass(staff.role)}`}>
                        {staff.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {staff.isActive ? (
                        <span className="flex items-center gap-1.5 text-green-700 text-xs font-medium bg-green-50 px-2 py-0.5 w-fit rounded-full border border-green-100">
                          <UserCheck className="w-3.5 h-3.5" />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-red-700 text-xs font-medium bg-red-50 px-2 py-0.5 w-fit rounded-full border border-red-100">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          Disabled
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(staff.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => handleEdit(staff)} className="text-blue-600 hover:text-blue-800 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(staff._id)} 
                          disabled={staff._id === userInfo._id}
                          className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <StaffModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          staffMember={selectedStaff}
        />
      )}
    </div>
  );
};

export default Staff;
