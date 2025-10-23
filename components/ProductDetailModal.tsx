import React, { useState, useEffect } from 'react';
import type { Product, CartItem } from '../types';
import { useToast } from '../contexts/ToastContext';

interface ProductDetailModalProps {
    product: Product;
    onClose: () => void;
    onAddToCart: (item: Omit<CartItem, 'id'>) => void;
    onBuyNow: (item: Omit<CartItem, 'id'>) => void;
}

const XIcon: React.FC = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const ShareIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
    </svg>
);

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose, onAddToCart, onBuyNow }) => {
    const { addToast } = useToast();
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});

    // Pre-select first option if available
    useEffect(() => {
        const initialOptions: { [key:string]: string } = {};
        product.options?.forEach(opt => {
            if (opt.values.length > 0) {
                initialOptions[opt.name] = opt.values[0];
            }
        });
        setSelectedOptions(initialOptions);
    }, [product]);

    const handleOptionChange = (optionName: string, value: string) => {
        setSelectedOptions(prev => ({ ...prev, [optionName]: value }));
    };

    const handleAddToCartClick = () => {
        onAddToCart({ product, quantity, selectedOptions });
    };
    
    const handleBuyNowClick = () => {
        onBuyNow({ product, quantity, selectedOptions });
    };

    const handleShareClick = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            addToast('تم نسخ رابط المنتج!', 'success');
        }, () => {
            addToast('فشل نسخ الرابط.', 'error');
        });
    };

    const totalCost = product.price * quantity;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="relative bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-fade-in-scale" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors z-10">
                    <XIcon />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="w-full h-full min-h-[300px] md:min-h-0 md:rounded-r-lg bg-cover bg-center" style={{ backgroundImage: `url(${product.imageUrls[0]})` }}></div>
                    <div className="p-8 flex flex-col">
                        <div className="flex justify-between items-start gap-4">
                            <h2 className="text-3xl font-bold text-white mb-2">{product.name}</h2>
                            <button 
                                onClick={handleShareClick} 
                                className="p-2 rounded-full text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 transition-colors flex-shrink-0" 
                                aria-label="مشاركة المنتج"
                            >
                                <ShareIcon />
                            </button>
                        </div>
                        <p className="text-gray-400 mb-6 flex-grow">{product.description}</p>
                        
                        <div className="space-y-4 mb-6">
                            {product.options?.map(option => (
                                <div key={option.name}>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">{option.name}</label>
                                    <select 
                                        value={selectedOptions[option.name] || ''}
                                        onChange={e => handleOptionChange(option.name, e.target.value)}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-md text-white py-2 px-3 focus:ring-pink-500 focus:border-pink-500"
                                    >
                                        {option.values.map(val => <option key={val} value={val}>{val}</option>)}
                                    </select>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center space-x-4 mb-6">
                             <label className="text-sm font-medium text-gray-300">الكمية</label>
                             <input 
                                type="number" 
                                min="1" 
                                value={quantity} 
                                onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-20 bg-gray-700 border border-gray-600 rounded-md text-white p-2 text-center focus:ring-pink-500 focus:border-pink-500"
                            />
                        </div>
                        
                        <div className="mt-auto">
                            <div className="text-2xl font-extrabold text-white mb-2">
                                الإجمالي: <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">{totalCost.toLocaleString('fr-DZ')} دج</span>
                            </div>
                             <p className="text-xs text-gray-400 mb-4">بعد الضغط على "شراء الآن"، سيتم توجيهك لإرسال الطلب عبر واتساب.</p>
                             <div className="flex flex-col sm:flex-row gap-3">
                                <button 
                                    onClick={handleBuyNowClick}
                                    className="w-full py-3 px-6 text-base font-medium rounded-md text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-pink-500 transition-transform transform hover:scale-105"
                                >
                                    شراء الآن
                                </button>
                                <button 
                                    onClick={handleAddToCartClick}
                                    className="w-full py-3 px-6 text-base font-medium rounded-md text-white bg-gray-600 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500 transition-all"
                                >
                                    أضف إلى السلة
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};