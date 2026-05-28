import { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, AlertCircle } from 'lucide-react';
import useMedicineStore from '../store/medicineStore';
import toast from 'react-hot-toast';
import MedicineModal from '../components/MedicineModal';

const Inventory = () => {
  const { medicines, fetchMedicines, deleteMedicine, isLoading } = useMedicineStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMedicines(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchMedicines]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      const success = await deleteMedicine(id);
      if (success) toast.success('Medicine deleted successfully');
    }
  };

  const handleEdit = (medicine) => {
    setSelectedMedicine(medicine);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedMedicine(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Inventory</h1>
        <button
          onClick={handleAddNew}
          className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-md shadow-primary-500/20"
        >
          <Plus className="w-5 h-5" />
          Add Medicine
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search medicines by name..."
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
                <th className="px-6 py-4">Medicine Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Price (₹)</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading && medicines.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">Loading medicines...</td>
                </tr>
              ) : medicines.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">No medicines found.</td>
                </tr>
              ) : (
                medicines.map((medicine) => (
                  <tr key={medicine._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{medicine.name}</div>
                      <div className="text-xs text-gray-500">{medicine.manufacturer || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                        {medicine.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${medicine.stockQuantity <= medicine.lowStockThreshold ? 'text-red-600' : 'text-gray-900'}`}>
                          {medicine.stockQuantity}
                        </span>
                        {medicine.stockQuantity <= medicine.lowStockThreshold && (
                          <AlertCircle className="w-4 h-4 text-red-500" title="Low Stock" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      ₹{medicine.sellingPrice}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => handleEdit(medicine)} className="text-blue-600 hover:text-blue-800 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(medicine._id)} className="text-red-600 hover:text-red-800 transition-colors">
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
        <MedicineModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          medicine={selectedMedicine}
        />
      )}
    </div>
  );
};

export default Inventory;
