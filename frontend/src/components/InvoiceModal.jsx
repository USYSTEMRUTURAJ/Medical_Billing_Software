import { useRef } from 'react';
import { X, Printer } from 'lucide-react';

const InvoiceModal = ({ isOpen, onClose, sale }) => {
  const printRef = useRef();

  if (!isOpen || !sale) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Modal Overlay for Screen */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4 print:hidden">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">Invoice Generated</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-8 overflow-y-auto bg-gray-50">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-lg mx-auto">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Medical Pharmacy</h1>
                <p className="text-gray-500">123 Health Ave, Wellness City</p>
                <p className="text-gray-500">Phone: +91 9876543210</p>
              </div>
              
              <div className="border-t border-b border-gray-100 py-4 mb-6 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Invoice No:</span> <span className="font-medium text-gray-800">{sale.invoiceNumber}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Date:</span> <span className="font-medium text-gray-800">{new Date(sale.createdAt).toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Customer:</span> <span className="font-medium text-gray-800">{sale.customerName}</span></div>
                {sale.customerPhone && <div className="flex justify-between"><span className="text-gray-500">Phone:</span> <span className="font-medium text-gray-800">{sale.customerPhone}</span></div>}
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-xs font-bold text-gray-500 uppercase pb-2 border-b border-gray-100">
                  <span className="flex-1">Item</span>
                  <span className="w-16 text-center">Qty</span>
                  <span className="w-24 text-right">Price</span>
                </div>
                {sale.saleItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="flex-1 font-medium text-gray-800">{item.name}</span>
                    <span className="w-16 text-center text-gray-600">{item.quantity}</span>
                    <span className="w-24 text-right text-gray-800">₹{item.totalItemPrice.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Subtotal</span> <span className="font-medium text-gray-800">₹{sale.subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">GST</span> <span className="font-medium text-gray-800">₹{sale.gstTotal.toFixed(2)}</span></div>
                {sale.discount > 0 && <div className="flex justify-between"><span className="text-gray-500">Discount</span> <span className="font-medium text-red-500">-₹{sale.discount.toFixed(2)}</span></div>}
                <div className="flex justify-between pt-2 border-t border-gray-100 text-lg font-bold">
                  <span className="text-gray-800">Total</span>
                  <span className="text-primary-600">₹{sale.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 text-xs"><span className="text-gray-500">Payment Mode:</span> <span className="font-medium text-gray-800">{sale.paymentMethod}</span></div>
              </div>
              
              <div className="text-center mt-8 text-sm text-gray-500">
                <p>Thank you for your visit!</p>
                <p>Get well soon</p>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-medium text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-md shadow-primary-500/20 flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print Bill
            </button>
          </div>
        </div>
      </div>

      {/* Hidden Printable Area */}
      <div className="hidden print:block absolute inset-0 bg-white p-8 text-black z-[100]">
        <div className="max-w-md mx-auto font-sans">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Medical Pharmacy</h1>
            <p className="text-sm">123 Health Ave, Wellness City</p>
            <p className="text-sm">Phone: +91 9876543210</p>
          </div>
          
          <div className="border-t border-b border-gray-300 py-2 mb-4 space-y-1 text-sm">
            <div className="flex justify-between"><span>Invoice No:</span> <span className="font-semibold">{sale.invoiceNumber}</span></div>
            <div className="flex justify-between"><span>Date:</span> <span className="font-semibold">{new Date(sale.createdAt).toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Customer:</span> <span className="font-semibold">{sale.customerName}</span></div>
            {sale.customerPhone && <div className="flex justify-between"><span>Phone:</span> <span className="font-semibold">{sale.customerPhone}</span></div>}
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-xs font-bold uppercase pb-1 border-b border-gray-300">
              <span className="flex-1">Item</span>
              <span className="w-12 text-center">Qty</span>
              <span className="w-20 text-right">Price</span>
            </div>
            {sale.saleItems.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="flex-1">{item.name}</span>
                <span className="w-12 text-center">{item.quantity}</span>
                <span className="w-20 text-right">₹{item.totalItemPrice.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-300 pt-2 space-y-1 text-sm">
            <div className="flex justify-between"><span>Subtotal</span> <span>₹{sale.subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>GST</span> <span>₹{sale.gstTotal.toFixed(2)}</span></div>
            {sale.discount > 0 && <div className="flex justify-between"><span>Discount</span> <span>-₹{sale.discount.toFixed(2)}</span></div>}
            <div className="flex justify-between pt-1 border-t border-gray-300 font-bold text-lg">
              <span>Total</span>
              <span>₹{sale.totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-1 text-xs"><span>Payment Mode:</span> <span>{sale.paymentMethod}</span></div>
          </div>
          
          <div className="text-center mt-6 text-sm">
            <p>Thank you for your visit!</p>
            <p>Get well soon</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceModal;
