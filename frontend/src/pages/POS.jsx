import { useState, useEffect, useRef } from 'react';
import { Search, Plus, Trash2, Printer, CreditCard, Banknote, ShoppingCart, User as UserIcon } from 'lucide-react';
import useMedicineStore from '../store/medicineStore';
import api from '../utils/api';
import toast from 'react-hot-toast';
import InvoiceModal from '../components/InvoiceModal';

const POS = () => {
  const { medicines, fetchMedicines, isLoading } = useMedicineStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [discount, setDiscount] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [completedSale, setCompletedSale] = useState(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    fetchMedicines('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [fetchMedicines]);

  const filteredMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (m.barcode && m.barcode.includes(searchTerm))
  ).slice(0, 10);

  const addToCart = (medicine) => {
    const existingItem = cart.find(item => item.medicine === medicine._id);
    
    if (existingItem) {
      if (existingItem.quantity + 1 > medicine.stockQuantity) {
        toast.error(`Only ${medicine.stockQuantity} in stock`);
        return;
      }
      setCart(cart.map(item => 
        item.medicine === medicine._id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      if (medicine.stockQuantity < 1) {
        toast.error('Out of stock');
        return;
      }
      setCart([...cart, { 
        medicine: medicine._id, 
        name: medicine.name, 
        price: medicine.sellingPrice,
        gstPercentage: medicine.gstPercentage,
        stockQuantity: medicine.stockQuantity,
        quantity: 1 
      }]);
    }
    setSearchTerm('');
    if (searchInputRef.current) searchInputRef.current.focus();
  };

  const updateQuantity = (id, newQty) => {
    const item = cart.find(i => i.medicine === id);
    if (!item) return;

    if (newQty > item.stockQuantity) {
      toast.error(`Only ${item.stockQuantity} in stock`);
      return;
    }
    if (newQty < 1) return;

    setCart(cart.map(i => i.medicine === id ? { ...i, quantity: newQty } : i));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.medicine !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const gstTotal = cart.reduce((sum, item) => sum + ((item.price * item.gstPercentage / 100) * item.quantity), 0);
  const total = subtotal + gstTotal - discount;

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    setIsCheckingOut(true);
    try {
      const { data } = await api.post('/sales', {
        customerName,
        customerPhone,
        saleItems: cart.map(item => ({
          medicine: item.medicine,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          gstPercentage: item.gstPercentage
        })),
        paymentMethod,
        discount
      });

      toast.success('Sale completed successfully!');
      
      setCompletedSale(data);
      setCart([]);
      setCustomerName('Walk-in Customer');
      setCustomerPhone('');
      setDiscount(0);
      setSearchTerm('');
      fetchMedicines('');

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to complete sale');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() !== '') {
      const exactMatch = medicines.find(m => m.barcode === term.trim());
      if (exactMatch) {
        addToCart(exactMatch);
      }
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="relative">
            <Search className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Scan barcode or search medicine..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-4 text-lg rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white shadow-sm"
              autoFocus
            />
          </div>
          
          {searchTerm && (
            <div className="absolute left-6 right-6 z-20 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
              {filteredMedicines.length > 0 ? (
                <ul className="divide-y divide-gray-100 max-h-80 overflow-auto">
                  {filteredMedicines.map(med => (
                    <li 
                      key={med._id}
                      onClick={() => addToCart(med)}
                      className="px-6 py-4 hover:bg-primary-50 cursor-pointer flex justify-between items-center transition-colors"
                    >
                      <div>
                        <p className="font-bold text-gray-800">{med.name}</p>
                        <p className="text-sm text-gray-500">Stock: {med.stockQuantity} | GST: {med.gstPercentage}%</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary-600">₹{med.sellingPrice}</p>
                        <button className="text-sm text-primary-500 font-medium mt-1 hover:underline">Add to Cart</button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-6 text-center text-gray-500">No medicines found.</div>
              )}
            </div>
          )}
        </div>

        <div className="flex-1 p-6 bg-gray-50 overflow-auto">
           {medicines.length > 0 ? (
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
               {medicines.map(med => (
                 <div 
                   key={med._id} 
                   onClick={() => addToCart(med)}
                   className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:border-primary-500 hover:shadow-md transition-all flex flex-col items-center text-center"
                 >
                   <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mb-3">
                     <span className="text-lg font-bold text-primary-600">{med.name.charAt(0)}</span>
                   </div>
                   <h3 className="font-bold text-gray-800 line-clamp-1">{med.name}</h3>
                   <p className="text-primary-600 font-bold mt-1">₹{med.sellingPrice}</p>
                   <p className="text-xs text-gray-500 mt-1">Stock: {med.stockQuantity}</p>
                 </div>
               ))}
             </div>
           ) : (
             <div className="text-center opacity-50 flex flex-col items-center justify-center h-full">
               <ShoppingCart className="w-24 h-24 mx-auto mb-4 text-gray-400" />
               <p className="text-xl font-medium text-gray-500">No items available</p>
             </div>
           )}
        </div>
      </div>

      <div className="w-[400px] bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-primary-900 text-white">
          <div className="flex items-center gap-3 bg-primary-800 p-3 rounded-xl mb-3 border border-primary-700">
            <UserIcon className="w-5 h-5 text-primary-300" />
            <input 
              type="text" 
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Customer Name"
              className="bg-transparent text-sm w-full focus:outline-none placeholder-primary-400 font-medium"
            />
          </div>
          <input 
            type="text" 
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="Mobile Number"
            className="w-full bg-primary-800 px-4 py-2.5 rounded-xl border border-primary-700 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm placeholder-primary-400"
          />
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-3 bg-gray-50/50">
          {cart.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">Cart is empty</div>
          ) : (
            cart.map(item => (
              <div key={item.medicine} className="flex flex-col gap-2 p-3 bg-white rounded-xl shadow-sm border border-gray-100 relative group">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-gray-800 text-sm pr-6 leading-tight">{item.name}</span>
                  <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                    <button onClick={() => updateQuantity(item.medicine, item.quantity - 1)} className="px-2.5 py-1 text-gray-600 hover:bg-gray-200">-</button>
                    <span className="px-3 py-1 font-medium text-sm border-x border-gray-200 bg-white">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.medicine, item.quantity + 1)} className="px-2.5 py-1 text-gray-600 hover:bg-gray-200">+</button>
                  </div>
                  <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-1 rounded">GST: {item.gstPercentage}%</span>
                </div>
                <button 
                  onClick={() => removeFromCart(item.medicine)}
                  className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-1.5 shadow border border-red-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-gray-100 p-5 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] space-y-4">
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (GST)</span>
              <span className="font-medium text-gray-900">₹{gstTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Discount</span>
              <div className="flex items-center">
                <span className="mr-1">₹</span>
                <input 
                  type="number" 
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-16 px-2 py-1 text-right border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 bg-gray-50"
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-between items-end">
            <span className="text-lg font-bold text-gray-800">Total</span>
            <span className="text-3xl font-black text-primary-600">₹{Math.max(0, total).toFixed(2)}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {['Cash', 'UPI', 'Card', 'Credit'].map(method => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`py-2 rounded-xl font-medium text-sm flex justify-center items-center gap-2 border transition-all ${
                  paymentMethod === method 
                    ? 'bg-primary-50 border-primary-500 text-primary-700 shadow-sm' 
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {method === 'Cash' ? <Banknote className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                {method}
              </button>
            ))}
          </div>

          <button
            onClick={handleCheckout}
            disabled={isCheckingOut || cart.length === 0}
            className="w-full mt-4 bg-primary-600 text-white font-bold py-4 rounded-xl shadow-xl shadow-primary-500/30 hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
          >
            {isCheckingOut ? (
               <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Printer className="w-5 h-5" />
                Pay & Print
              </>
            )}
          </button>
        </div>
      </div>

      <InvoiceModal 
        isOpen={!!completedSale} 
        onClose={() => setCompletedSale(null)} 
        sale={completedSale} 
      />
    </div>
  );
};

export default POS;
