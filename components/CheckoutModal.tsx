import React, { useState } from 'react';
import type { CartItem, OrderDetails, PlacedOrder } from '../types';
import { locations } from '../data/algeria-locations';
import { useToast } from '../contexts/ToastContext';

interface CheckoutModalProps {
    items: CartItem[];
    onClose: () => void;
    homeDeliveryCost: number;
    officeDeliveryCost: number;
}

const XIcon: React.FC = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const WhatsAppIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95l-1.4 5.09 5.23-1.38c1.45.79 3.08 1.21 4.76 1.21h.01c5.46 0 9.91-4.45 9.91-9.91s-4.45-9.91-9.91-9.91zm0 18.23c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31c-.82-1.31-1.26-2.83-1.26-4.41 0-4.54 3.7-8.23 8.24-8.23 2.22 0 4.28.86 5.82 2.41 1.54 1.54 2.41 3.6 2.41 5.82-.01 4.54-3.7 8.24-8.24 8.24zm4.52-6.2c-.25-.12-1.47-.72-1.7-.85-.23-.12-.39-.18-.56.18-.17.37-.64.85-.79 1.02-.15.17-.29.18-.54.06-.25-.12-1.07-.39-2.04-1.26-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.44.12-.15.17-.25.25-.41.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.42h-.5c-.17 0-.44.06-.66.31-.22.25-.85.83-.85 2.02s.87 2.34 1 2.51c.12.17 1.71 2.62 4.14 3.63.59.25 1.05.4 1.41.51.6.18 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.12-.22-.18-.47-.3z"/>
    </svg>
);

const generateOrderSummary = (order: Omit<PlacedOrder, 'id' | 'createdAt'>): string => {
    let summary = `*طلبك هو*\n\n`;
    summary += `*👤 معلومات الزبون:*\n`;
    summary += `• الاسم: ${order.customer.name}\n`;
    summary += `• الهاتف: ${order.customer.phone}\n`;
    summary += `• الولاية: ${order.customer.wilaya}, ${order.customer.commune}\n`;
    if (order.customer.shippingMethod === 'home' && order.customer.address) {
        summary += `• العنوان: ${order.customer.address}\n`;
    }
    summary += `• التوصيل: ${order.customer.shippingMethod === 'home' ? 'للمنزل' : 'للمكتب'}\n\n`;

    summary += `*📦 المنتجات المطلوبة:*\n`;
    order.items.forEach(item => {
        summary += `• ${item.product.name} (x${item.quantity})\n`;
        if (item.selectedOptions && Object.keys(item.selectedOptions).length > 0) {
            for (const [key, value] of Object.entries(item.selectedOptions)) {
                summary += `  - ${key}: ${value}\n`;
            }
        }
    });
    summary += `\n`;

    summary += `*💰 الإجمالي النهائي:* ${order.totalAmount.toLocaleString('fr-DZ')} دج\n\n`;
    summary += `سيتم مراسلتك لاحقا لتأكيد الطلبية`;
    
    return summary;
};

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ items, onClose, homeDeliveryCost, officeDeliveryCost }) => {
    const { addToast } = useToast();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [wilaya, setWilaya] = useState('');
    const [commune, setCommune] = useState('');
    const [address, setAddress] = useState('');
    const [shippingMethod, setShippingMethod] = useState<'home' | 'office'>('office');

    const [isOrderCompleted, setIsOrderCompleted] = useState(false);
    const [completedOrder, setCompletedOrder] = useState<Omit<PlacedOrder, 'id' | 'createdAt'> | null>(null);

    const whatsappNumber = localStorage.getItem('whatsappNumber') || '';

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
        
        const customerDetails: OrderDetails = { name, phone, email, wilaya, commune, shippingMethod, address };
        
        const orderData: Omit<PlacedOrder, 'id' | 'createdAt'> = {
            customer: customerDetails,
            items: items,
            totalAmount: total,
        };
        
        setCompletedOrder(orderData);
        setIsOrderCompleted(true);
        addToast('تم تجهيز طلبك! يرجى إرساله لنا للتأكيد.', 'success');
    };
    
    let whatsappLink = '#';
    if (whatsappNumber && completedOrder) {
        const summary = generateOrderSummary(completedOrder);
        const message = summary;
        whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    }


    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div 
                className="relative bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col animate-fade-in-scale" 
                onClick={e => e.stopPropagation()}
            >
                <div className="p-5 flex justify-between items-center border-b border-gray-700">
                    <h2 className="text-2xl font-bold text-white">{isOrderCompleted ? 'أرسل طلبك للتأكيد' : 'إتمام الطلب'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <XIcon />
                    </button>
                </div>

                {!isOrderCompleted ? (
                    <>
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
                            <p className="text-xs text-center text-gray-400">لإتمام الطلب، يرجى إكمَال خطوة الإرسال عبر واتساب.</p>
                            <button 
                                onClick={handleSubmit}
                                className="w-full py-3 mt-2 text-base font-medium rounded-md text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-pink-500 transition-transform transform hover:scale-105"
                            >
                                تجهيز الطلب
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex-grow overflow-y-auto p-6 space-y-4 flex flex-col justify-center text-center">
                            <h3 className="text-xl font-semibold text-green-400">خطوة واحدة أخيرة!</h3>
                            <p className="text-gray-300">
                                لتأكيد طلبك، يرجى الضغط على الزر أدناه لإرساله عبر واتساب.
                            </p>
                            <div className="bg-gray-900/50 p-4 rounded-md text-gray-400 mt-4">
                                <p>سيتم فتح واتساب مع رسالة تحتوي على ملخص الطلب جاهزة للإرسال.</p>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-700 mt-auto space-y-3 bg-gray-800">
                            {whatsappNumber ? (
                                <a
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={onClose}
                                    className="w-full flex items-center justify-center py-3 px-6 text-base font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 transition-transform transform hover:scale-105"
                                >
                                    <WhatsAppIcon className="h-6 w-6 ml-2" />
                                    إرسال الطلب عبر واتساب
                                </a>
                            ) : (
                                <p className="text-center text-red-400 text-sm">لم يتم تكوين رقم واتساب في الإعدادات.</p>
                            )}
                            <button 
                                onClick={onClose}
                                className="w-full py-3 px-6 text-base font-medium rounded-md text-gray-300 bg-gray-600 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500 transition-all"
                            >
                                إلغاء
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};