
import React from 'react';
import type { PlacedOrder } from '../types';

interface OrderListModalProps {
    orders: PlacedOrder[];
    onClose: () => void;
    onClear: () => void;
}

const XIcon: React.FC = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const OrderListModal: React.FC<OrderListModalProps> = ({ orders, onClose, onClear }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-[110] p-4 animate-fade-in" onClick={onClose}>
            <div 
                className="relative bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-fade-in-scale" 
                onClick={e => e.stopPropagation()}
            >
                <div className="p-5 flex justify-between items-center border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
                    <h2 className="text-2xl font-bold text-white">قائمة الطلبات</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <XIcon />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto p-6 space-y-6">
                    {orders.length === 0 ? (
                         <div className="text-center py-16">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                            <h3 className="mt-2 text-xl font-medium text-gray-100">لا توجد طلبات بعد</h3>
                            <p className="mt-1 text-gray-400">ستظهر الطلبات الجديدة هنا.</p>
                        </div>
                    ) : (
                        orders.map(order => (
                            <div key={order.id} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="font-semibold text-white">{order.customer.name}</p>
                                        <p className="text-sm text-gray-400">{order.customer.phone}</p>
                                        <p className="text-sm text-gray-400">{order.customer.wilaya}, {order.customer.commune}</p>
                                        {order.customer.address && (
                                            <p className="text-sm text-gray-300 bg-gray-700/50 p-1 rounded-sm mt-1 inline-block">{order.customer.address}</p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">#{order.id.slice(-6)}</p>
                                        <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString('ar-DZ')}</p>
                                    </div>
                                </div>
                                
                                <div className="border-t border-b border-gray-700/50 my-2 py-2 text-sm">
                                    {order.items.map(item => (
                                        <div key={item.id} className="flex justify-between items-center">
                                            <span className="text-gray-300">{item.product.name} (x{item.quantity})</span>
                                            <span className="text-gray-300">{(item.product.price * item.quantity).toLocaleString('fr-DZ')} دج</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="text-sm text-gray-400 mb-2">
                                     <p>طريقة التوصيل: {order.customer.shippingMethod === 'home' ? 'للمنزل' : 'للمكتب'}</p>
                                </div>
                                
                                <div className="text-right mt-2">
                                    <span className="text-lg font-bold text-white">الإجمالي: </span>
                                    <span className="text-lg font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
                                        {order.totalAmount.toLocaleString('fr-DZ')} دج
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                 <div className="p-4 border-t border-gray-700 sticky bottom-0 bg-gray-800 z-10 flex justify-center items-center gap-4">
                    <button 
                        onClick={onClose}
                        className="py-2 px-6 text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500"
                    >
                        إغلاق
                    </button>
                     {orders.length > 0 && (
                        <button 
                            onClick={onClear}
                            className="py-2 px-6 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500"
                        >
                            مسح الإشعارات
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};