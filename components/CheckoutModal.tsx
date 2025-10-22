import React, { useState } from 'react';
import type { CartItem, OrderDetails } from '../types';
import { locations } from '../data/algeria-locations';
import { useToast } from '../contexts/ToastContext';

interface CheckoutModalProps {
    items: CartItem[];
    onClose: () => void;
    onConfirmOrder: (details: OrderDetails) => void;
    homeDeliveryCost: number;
    officeDeliveryCost: number;
}

const XIcon: React.FC = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ items, onClose, onConfirmOrder, homeDeliveryCost, officeDeliveryCost }) => {
    const { addToast } = useToast();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [wilaya, setWilaya] = useState('');
    const [commune, setCommune] = useState('');
    const [address, setAddress] = useState('');
    const [shippingMethod, setShippingMethod] = useState<'home' | 'office'>('office');

    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const shippingCost = shippingMethod === 'home' ? homeDeliveryCost : officeDeliveryCost;
    const total = subtotal + shippingCost;
    const communesForWilaya = wilaya ? locations.find(l => l.wilaya === wilaya)?.communes || [] : [];

    const handleSubmit = () => {
        if (!name || !phone || !wilaya || !commune) {
            addToast('الرجاء ملء جميع الحقول الإلزامية.', 'error');
            return;
        }
        if (shippingMethod === 'home' && !address) {
            addToast('الرجاء إدخال عنوان التوصيل للمنزل.', 'error');
            return;
        }
        onConfirmOrder({ name, phone, email, wilaya, commune, shippingMethod, address });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div 
                className="relative bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col animate-fade-in-scale" 
                onClick={e => e.stopPropagation()}
            >
                <div className="p-5 flex justify-between items-center border-b border-gray-700">
                    <h2 className="text-2xl font-bold text-white">إتمام الطلب</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <XIcon />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto p-6 space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">الاسم الكامل *</label>
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="block w-full border-gray-600 bg-gray-700 text-gray-100 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm" />
                    </div>
                     <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">رقم الهاتف *</label>
                        <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} required className="block w-full border-gray-600 bg-gray-700 text-gray-100 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm" />
                    </div>
                     <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">البريد الإلكتروني (اختياري)</label>
                        <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="block w-full border-gray-600 bg-gray-700 text-gray-100 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm" />
                    </div>

                    <div className="space-y-4 pt-4 border-t border-gray-700/50">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">الولاية *</label>
                                <select value={wilaya} onChange={e => { setWilaya(e.target.value); setCommune('') }} required className="w-full bg-gray-700 border border-gray-600 rounded-md text-white py-2 px-3 focus:ring-pink-500 focus:border-pink-500">
                                    <option value="">اختر الولاية</option>
                                    {locations.map(loc => <option key={loc.wilaya} value={loc.wilaya}>{loc.wilaya}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">البلدية *</label>
                                <select value={commune} onChange={e => setCommune(e.target.value)} disabled={!wilaya} required className="w-full bg-gray-700 border border-gray-600 rounded-md text-white py-2 px-3 focus:ring-pink-500 focus:border-pink-500 disabled:opacity-50">
                                    <option value="">اختر البلدية</option>
                                    {communesForWilaya.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>
                        {shippingMethod === 'home' && (
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">العنوان (الحي، الشارع، رقم المنزل...) *</label>
                                <input type="text" id="address" value={address} onChange={e => setAddress(e.target.value)} required className="block w-full border-gray-600 bg-gray-700 text-gray-100 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm" placeholder="مثال: حي النصر، شارع الحرية، رقم 15"/>
                            </div>
                        )}
                    </div>
                    
                     <div className="pt-4 border-t border-gray-700/50">
                        <h3 className="text-lg font-semibold text-white mb-2">طريقة التوصيل</h3>
                        <div className="space-y-3">
                             <label className="flex items-center p-3 border border-gray-600 rounded-md cursor-pointer hover:bg-gray-700/50 transition-colors">
                                <input type="radio" name="shipping" value="office" checked={shippingMethod === 'office'} onChange={() => setShippingMethod('office')} className="h-4 w-4 text-pink-600 border-gray-500 focus:ring-pink-500"/>
                                <span className="mr-3 text-sm font-medium text-gray-200">التوصيل للمكتب (نقطة استلام)</span>
                            </label>
                            <label className="flex items-center p-3 border border-gray-600 rounded-md cursor-pointer hover:bg-gray-700/50 transition-colors">
                                <input type="radio" name="shipping" value="home" checked={shippingMethod === 'home'} onChange={() => setShippingMethod('home')} className="h-4 w-4 text-pink-600 border-gray-500 focus:ring-pink-500"/>
                                <span className="mr-3 text-sm font-medium text-gray-200">التوصيل للمنزل</span>
                            </label>
                        </div>
                    </div>
                    
                </div>

                <div className="p-6 border-t border-gray-700 mt-auto space-y-4 bg-gray-800">
                    <div className="space-y-2 text-sm">
                       {items.map(item => (
                            <div key={item.id} className="flex justify-between text-gray-300">
                                <span>{item.product.name} x {item.quantity}</span>
                                <span>{(item.product.price * item.quantity).toLocaleString('fr-DZ')} دج</span>
                            </div>
                       ))}
                        <div className="flex justify-between text-gray-300">
                            <span>التوصيل</span>
                            <span>{shippingCost > 0 ? `${shippingCost.toLocaleString('fr-DZ')} دج` : 'مجاني'}</span>
                        </div>
                    </div>
                    <div className="flex justify-between text-xl border-t border-gray-600 pt-3">
                        <span className="text-white font-bold">الإجمالي</span>
                        <span className="font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">{total.toLocaleString('fr-DZ')} دج</span>
                    </div>
                     <p className="text-xs text-center text-gray-400">سيتم الاتصال بك لتأكيد الطلبية.</p>
                    <button 
                        onClick={handleSubmit}
                        className="w-full py-3 mt-2 text-base font-medium rounded-md text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-pink-500 transition-transform transform hover:scale-105"
                    >
                        تأكيد الطلب
                    </button>
                </div>
            </div>
        </div>
    );
};