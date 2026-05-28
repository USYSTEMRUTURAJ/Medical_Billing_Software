import { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, Truck } from 'lucide-react';
import useSupplierStore from '../store/supplierStore';
import toast from 'react-hot-toast';
import SupplierModal from '../components/SupplierModal';
import useAuthStore from '../store/authStore';

const Suppliers = () => {
  const { suppliers, fetchSuppliers, deleteSupplier, isLoading } = useSupplierStore();
  const { userInfo } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchSuppliers(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchSuppliers]);

  const handleDelete = async (id) => {
    const canDelete = userInfo?.role === 'Admin';
    if (!canDelete) {
      toast.error('Only Admin is authorized to delete suppliers');
      return;
    }

    if (window.confirm('Are you sure you want to delete this supplier?')) {
      const success = await deleteSupplier(id);
      if (success) toast.success('Supplier deleted successfully');
    }
  };

  const handleEdit = (supplier) => {
    const canEdit = userInfo?.role === 'Admin' || userInfo?.role === 'Manager';
    if (!canEdit) {
      toast.error('Only Admin and Manager are authorized to edit suppliers');
      return;
    }
    setSelectedSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    const canAdd = userInfo?.role === 'Admin' || userInfo?.role === 'Manager';
    if (!canAdd) {
      toast.error('Only Admin and Manager are authorized to add suppliers');
      return;
    }
    setSelectedSupplier(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Suppliers</h1>
          <p className="text-gray-500 mt-1">Manage medicine distributors and suppliers information</p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-md shadow-primary-500/20"
        >
          <Plus className="w-5 h-5" />
          Add Supplier
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search suppliers by name or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 text-gray-700 uppercase font-semibold text-xs">
              <tr>
                <th className="px-6 py-4">Supplier Details</th>
                <th className="px-6 py-4">Company Name</th>
                <th className="px-6 py-4">Phone Number</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Address</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading && suppliers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">Loading suppliers...</td>
                </tr>
              ) : suppliers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center justify-center py-6">
                      <Truck className="w-12 h-12 text-gray-300 mb-2" />
                      <span>No suppliers found.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                suppliers.map((supplier) => (
                  <tr key={supplier._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {supplier.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-medium">
                        {supplier.companyName || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {supplier.phone}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {supplier.email || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-gray-500 max-w-xs truncate">
                      {supplier.address || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => handleEdit(supplier)} className="text-blue-600 hover:text-blue-800 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(supplier._id)} className="text-red-600 hover:text-red-800 transition-colors">
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
        <SupplierModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          supplier={selectedSupplier}
        />
      )}
    </div>
  );
};

export default Suppliers;
