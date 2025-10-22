
import React, { useState, useEffect } from 'react';
import type { Product } from '../types';
import { useToast } from '../contexts/ToastContext';

interface EditProductModalProps {
    product: Product;
    categories: string[];
    onClose: () => void;
    onUpdate: (product: Product) => void;
}

const XIcon: React.FC = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);


export const EditProductModal: React.FC<EditProductModalProps> = ({ product, categories, onClose, onUpdate }) => {
    const { addToast } = useToast();
    const [name, setName] = useState(product.name);
    const [price, setPrice] = useState(product.price.toString());
    const [category, setCategory] = useState(product.category);
    const [description, setDescription] = useState(product.description);
    const [imageUrls, setImageUrls] = useState(product.imageUrls);


    useEffect(() => {
        setName(product.name);
        setPrice(product.price.toString());
        setCategory(product.category);
        setDescription(product.description);
        setImageUrls(product.imageUrls);
    }, [product]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            // Fix: Explicitly type `file` to resolve type ambiguity with Blob.
            const filePromises = files.map((file: File) => {
                return new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(filePromises)
                .then(base64Images => {
                    setImageUrls(prev => [...prev, ...base64Images]);
                })
                .catch(error => {
                    console.error("Error reading files:", error);
                    addToast("حدث خطأ أثناء تحميل الصور.", "error");
                });
        }
    };

    const removeImage = (indexToRemove: number) => {
        if (imageUrls.length <= 1) {
            addToast("يجب أن يحتوي المنتج على صورة واحدة على الأقل.", "error");
            return;
        }
        setImageUrls(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const priceValue = parseFloat(price);

        if (!name || !description || !category || imageUrls.length === 0) {
            addToast('الرجاء ملء جميع الحقول والتأكد من وجود صورة واحدة على الأقل.', 'error');
            return;
        }

        if (isNaN(priceValue) || priceValue <= 0) {
            addToast('الرجاء إدخال سعر صحيح.', 'error');
            return;
        }
        
        onUpdate({
            ...product,
            name,
            price: priceValue,
            description,
            category,
            imageUrls,
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="relative bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in-scale" onClick={e => e.stopPropagation()}>
                <div className="p-5 flex justify-between items-center border-b border-gray-700">
                    <h2 className="text-2xl font-bold text-white">تعديل المنتج</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><XIcon /></button>
                </div>
                
                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="edit-name" className="block text-sm font-medium text-gray-300 mb-1">اسم المنتج</label>
                            <input type="text" id="edit-name" value={name} onChange={e => setName(e.target.value)} className="block w-full border-gray-600 bg-gray-700 text-gray-100 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="edit-category" className="block text-sm font-medium text-gray-300 mb-1">الفئة</label>
                            <select id="edit-category" value={category} onChange={e => setCategory(e.target.value)} className="block w-full border-gray-600 bg-gray-700 text-gray-100 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm">
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="edit-price" className="block text-sm font-medium text-gray-300 mb-1">السعر (دج)</label>
                        <input type="number" id="edit-price" value={price} onChange={e => setPrice(e.target.value)} step="100" className="block w-full border-gray-600 bg-gray-700 text-gray-100 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm" />
                    </div>
                    
                    <div>
                        <label htmlFor="edit-description" className="block text-sm font-medium text-gray-300 mb-1">الوصف</label>
                        <textarea id="edit-description" value={description} onChange={e => setDescription(e.target.value)} rows={5} className="block w-full border-gray-600 bg-gray-700 text-gray-100 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"></textarea>
                    </div>

                    <div className="border-t border-gray-700 pt-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">صور المنتج</label>
                        {imageUrls.length > 0 && (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4 p-2 bg-gray-700/50 rounded-md">
                                {imageUrls.map((url, index) => (
                                    <div key={index} className="relative group">
                                        <img src={url} alt={`Product image ${index + 1}`} className="h-24 w-full object-cover rounded-md" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            aria-label="Remove image"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <label htmlFor="edit-file-upload" className="relative cursor-pointer bg-gray-600 py-2 px-3 border border-gray-500 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-200 hover:bg-gray-500">
                            <span>إضافة صور جديدة</span>
                            <input id="edit-file-upload" name="edit-file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" multiple />
                        </label>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="py-2 px-6 text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500">
                           إلغاء
                        </button>
                        <button type="submit" className="py-2 px-6 text-sm font-medium rounded-md text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-pink-500">
                           حفظ التغييرات
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
