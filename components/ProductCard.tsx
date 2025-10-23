
import React, { useState } from 'react';
import type { Product, CartItem } from '../types';
import { useToast } from '../contexts/ToastContext';

interface ProductCardProps {
    product: Product;
    onDelete: (productId: string) => void;
    onAddToCart: (item: Omit<CartItem, 'id'>) => void;
    onBuyNow: (item: Omit<CartItem, 'id'>) => void;
    onEdit: (product: Product) => void;
    isAdminView: boolean;
    onViewDetails: (product: Product) => void;
}

const DeleteIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const EditIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" />
    </svg>
);

const ShareIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
    </svg>
);


export const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete, onAddToCart, onBuyNow, onEdit, isAdminView, onViewDetails }) => {
    const { addToast } = useToast();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex(prev => (prev + 1) % product.imageUrls.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex(prev => (prev - 1 + product.imageUrls.length) % product.imageUrls.length);
    };

    const handleShareClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        const url = new URL(window.location.origin + window.location.pathname);
        url.searchParams.set('product', product.id);
        navigator.clipboard.writeText(url.toString()).then(() => {
            addToast('تم نسخ رابط المنتج!', 'success');
        }, () => {
            addToast('فشل نسخ الرابط.', 'error');
        });
    };
    
    return (
        <div
            onClick={() => { if (!isAdminView) onViewDetails(product); }}
            className={`bg-gray-800 rounded-xl shadow-md overflow-hidden transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 flex flex-col group border border-gray-700 hover:border-purple-500/70 ${!isAdminView ? 'cursor-pointer' : ''}`}
        >
            <div className="relative group/image">
                <img className="w-full h-56 object-cover" src={product.imageUrls[currentImageIndex]} alt={product.name} />
                
                 {product.imageUrls.length > 1 && (
                    <>
                        <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity z-10 hover:bg-black/60">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity z-10 hover:bg-black/60">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                        </button>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
                            {product.imageUrls.map((_, index) => (
                                <button key={index} onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(index); }} className={`w-2.5 h-2.5 rounded-full transition-all ${index === currentImageIndex ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/75'}`}></button>
                            ))}
                        </div>
                    </>
                )}

                 {isAdminView ? (
                    <div className="absolute top-3 left-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button 
                            onClick={(e) => { e.stopPropagation(); onEdit(product); }}
                            className="p-2 bg-gray-900/70 rounded-full text-cyan-400 hover:bg-cyan-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 transition-all duration-200 scale-90 group-hover:scale-100"
                            aria-label="تعديل المنتج"
                        >
                            <EditIcon />
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onDelete(product.id); }}
                            className="p-2 bg-gray-900/70 rounded-full text-red-500 hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500 transition-all duration-200 scale-90 group-hover:scale-100"
                            aria-label="حذف المنتج"
                        >
                            <DeleteIcon />
                        </button>
                    </div>
                 ) : (
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                            onClick={handleShareClick}
                            className="p-2 bg-gray-900/70 rounded-full text-cyan-400 hover:bg-cyan-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 transition-all duration-200 scale-90 group-hover:scale-100"
                            aria-label="مشاركة المنتج"
                        >
                            <ShareIcon />
                        </button>
                    </div>
                 )}
            </div>
            <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-semibold text-gray-100 mb-2 truncate">{product.name}</h3>
                <p className="text-gray-400 text-sm mb-4 flex-grow">{product.description}</p>
                <div className="flex justify-between items-center mt-auto">
                    <p className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
                        {product.price.toLocaleString('fr-DZ')} دج
                    </p>
                    {!isAdminView && (
                         <span className="text-xs font-semibold rounded-md text-gray-300">
                            انقر للتفاصيل
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
