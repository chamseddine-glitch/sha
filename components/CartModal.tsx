
import React from 'react';
import type { CartItem } from '../types';

interface CartModalProps {
    items: CartItem[];
    onClose: () => void;
    onRemoveItem: (itemId: string) => void;
    onCheckout: () => void;
}

const XIcon: React.FC = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const CartModal: React.FC<CartModalProps> = ({ items, onClose, onRemoveItem, onCheckout }) => {

    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const total = subtotal; 

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-end z-50" onClick={onClose}>
            <div 
                className="relative bg-gray-800 shadow-xl w-full max-w-md h-full flex flex-col animate-slide-in-right" 
                onClick={e => e.stopPropagation()}
            >
                <style>{`
                    @keyframes slide-in-right {
                        from { transform: translateX(100%); }
                        to { transform: translateX(0); }
                    }
                    .animate-slide-in-right { animation: slide-in-right 0.3s ease-out forwards; }
                `}</style>
                <div className="p-6 flex justify-between items-center border-b border-gray-700">
                    <h2 className="text-2xl font-bold text-white">سلّتك</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <XIcon />
                    </button>
                </div>
                
                {items.length === 0 ? (
                    <div className="flex-grow flex flex-col justify-center items-center text-center p-6">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h3 className="text-xl font-medium text-gray-100">سلّتك فارغة</h3>
                        <p className="mt-1 text-gray-400">أضف منتجات لرؤيتها هنا.</p>
                    </div>
                ) : (
                    <div className="flex-grow overflow-y-auto p-6 space-y-4">
                        {items.map(item => (
                            <div key={item.id} className="flex items-start space-x-4 p-3 bg-gray-700/50 rounded-md">
                                <img src={item.product.imageUrls[0]} alt={item.product.name} className="w-20 h-20 object-cover rounded-md flex-shrink-0" />
                                <div className="flex-grow">
                                    <h4 className="font-semibold text-white truncate">{item.product.name}</h4>
                                    <div className="text-sm text-gray-400">
                                        {Object.entries(item.selectedOptions).map(([key, value]) => (
                                            <p key={key}>{key}: {value}</p>
                                        ))}
                                    </div>
                                     <p className="text-sm text-gray-400">الكمية: {item.quantity}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                     <p className="font-bold text-white mb-2">{(item.product.price * item.quantity).toLocaleString('fr-DZ')} دج</p>
                                     <button onClick={() => onRemoveItem(item.id)} className="text-xs text-red-400 hover:underline">إزالة</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {items.length > 0 && (
                     <div className="p-6 border-t border-gray-700 mt-auto space-y-4">
                        <div className="flex justify-between text-lg">
                            <span className="text-gray-300">المجموع الفرعي</span>
                            <span className="font-bold text-white">{subtotal.toLocaleString('fr-DZ')} دج</span>
                        </div>
                         <div className="flex justify-between text-sm">
                            <span className="text-gray-400">التوصيل</span>
                            <span className="text-gray-400">يحسب عند الدفع</span>
                        </div>
                         <div className="flex justify-between text-xl border-t border-gray-700 pt-4">
                            <span className="text-white font-bold">الإجمالي</span>
                            <span className="font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">{total.toLocaleString('fr-DZ')} دج</span>
                        </div>
                        <button 
                            onClick={onCheckout}
                            className="w-full py-3 mt-4 text-base font-medium rounded-md text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-pink-500 transition-transform transform hover:scale-105"
                        >
                            متابعة للدفع
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};