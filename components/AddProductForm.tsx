
import React, { useState, useEffect } from 'react';
import { generateDescription } from '../services/geminiService';
import type { Product, ProductOption } from '../types';
import { useToast } from '../contexts/ToastContext';

interface AddProductFormProps {
    onAddProduct: (product: Omit<Product, 'id'>) => void;
    categories: string[];
}

const SparkleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v2.586l1.293-1.293a1 1 0 111.414 1.414l-1.293 1.293V10a1 1 0 11-2 0V7.414l-1.293 1.293a1 1 0 01-1.414-1.414l1.293-1.293V4a1 1 0 011-1zM3 10a1 1 0 011-1h2.586l-1.293-1.293a1 1 0 111.414-1.414L8.586 8H10a1 1 0 110 2H8.586l-1.293 1.293a1 1 0 01-1.414-1.414L7.414 10H4a1 1 0 01-1-1zm14 0a1 1 0 01-1 1h-2.586l1.293 1.293a1 1 0 11-1.414 1.414L11.414 12H10a1 1 0 110-2h1.414l1.293-1.293a1 1 0 111.414 1.414L12.586 10H15a1 1 0 011 1zM10 17a1 1 0 01-1-1v-2.586l-1.293 1.293a1 1 0 11-1.414-1.414l1.293-1.293V10a1 1 0 112 0v2.586l1.293-1.293a1 1 0 111.414 1.414l-1.293 1.293V16a1 1 0 01-1 1z" clipRule="evenodd" />
    </svg>
);

const SpinnerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export const AddProductForm: React.FC<AddProductFormProps> = ({ onAddProduct, categories }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState(categories[0] || '');
    const [description, setDescription] = useState('');
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [options, setOptions] = useState<ProductOption[]>([{ name: '', values: [] }]);
    const { addToast } = useToast();

    useEffect(() => {
        if (!category && categories.length > 0) {
            setCategory(categories[0]);
        }
    }, [categories, category]);

    const handleOptionNameChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index].name = value;
        setOptions(newOptions);
    };

    const handleOptionValuesChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index].values = value.split(',').map(v => v.trim()).filter(Boolean);
        setOptions(newOptions);
    };

    const addOptionField = () => {
        setOptions([...options, { name: '', values: [] }]);
    };

    const removeOptionField = (index: number) => {
        setOptions(options.filter((_, i) => i !== index));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            // Fix: Explicitly type `file` to resolve type ambiguity with Blob.
            const filePromises = files.map((file: File) => {
                return new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        resolve(reader.result as string);
                    };
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
        setImageUrls(prev => prev.filter((_, index) => index !== indexToRemove));
    };


    const handleGenerateDescription = async () => {
        if (!name) {
            addToast('الرجاء إدخال اسم المنتج أولاً لإنشاء وصف.', 'error');
            return;
        }
        setIsGenerating(true);
        try {
            const generatedDesc = await generateDescription(name);
            setDescription(generatedDesc);
            addToast('تم إنشاء الوصف بنجاح!', 'success');
        } catch (err) {
            addToast('فشل إنشاء الوصف.', 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !price || !description || imageUrls.length === 0 || !category) {
            addToast('الرجاء ملء جميع الحقول وتحميل صورة واحدة على الأقل.', 'error');
            return;
        }
        if (categories.length === 0) {
            addToast('الرجاء إضافة فئة واحدة على الأقل في قسم "إدارة الفئات".', 'error');
            return;
        }

        const priceValue = parseFloat(price);
        if (isNaN(priceValue) || priceValue <= 0) {
            addToast('الرجاء إدخال سعر صحيح.', 'error');
            return;
        }
        
        const validOptions = options.filter(opt => opt.name && opt.values.length > 0);

        onAddProduct({ name, price: priceValue, description, category, imageUrls, options: validOptions });
        
        // Reset form
        setName('');
        setPrice('');
        setDescription('');
        setCategory(categories[0] || '');
        setImageUrls([]);
        setOptions([{ name: '', values: [] }]);
    };

    return (
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 mb-8">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">إضافة منتج جديد</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                         <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">اسم المنتج</label>
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="block w-full border-gray-600 bg-gray-700 text-gray-100 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm placeholder-gray-400" placeholder="مثال: سماعات لاسلكية"/>
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">الفئة</label>
                        <select
                            id="category"
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            className="block w-full border-gray-600 bg-gray-700 text-gray-100 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm disabled:opacity-50"
                            disabled={categories.length === 0}
                        >
                            {categories.length > 0 ? (
                                categories.map(cat => <option key={cat} value={cat}>{cat}</option>)
                            ) : (
                                <option value="" disabled>أضف فئة في الإعدادات أولاً</option>
                            )}
                        </select>
                    </div>
                </div>

                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">السعر (دج)</label>
                    <input type="number" id="price" value={price} onChange={e => setPrice(e.target.value)} step="100" className="block w-full border-gray-600 bg-gray-700 text-gray-100 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm placeholder-gray-400" placeholder="مثال: 12500"/>
                </div>

                <div className="relative">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">الوصف</label>
                    <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} className="block w-full border-gray-600 bg-gray-700 text-gray-100 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm placeholder-gray-400" placeholder="صف منتجك..."></textarea>
                    <button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="absolute bottom-2 left-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-gray-600 disabled:from-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-transform transform hover:scale-105">
                        {isGenerating ? (
                            <SpinnerIcon className="h-4 w-4 ml-2" />
                        ) : (
                            <SparkleIcon className="h-4 w-4 ml-2" />
                        )}
                        {isGenerating ? 'جاري الإنشاء...' : 'إنشاء بالذكاء الاصطناعي'}
                    </button>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">صور المنتج</label>
                    {imageUrls.length > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mb-4 p-2 bg-gray-700/50 rounded-md">
                            {imageUrls.map((url, index) => (
                                <div key={index} className="relative group">
                                    <img src={url} alt={`Preview ${index + 1}`} className="h-24 w-full object-cover rounded-md" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        aria-label="Remove image"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                             <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex text-sm text-gray-400">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-pink-500 hover:text-pink-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-800 focus-within:ring-pink-500">
                                    <span>رفع ملفات</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" multiple/>
                                </label>
                                <p className="pr-1">أو قم بالسحب والإفلات</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF حتى 10 ميجابايت</p>
                        </div>
                    </div>
                </div>
                
                <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-lg font-medium text-gray-100 mb-4">خيارات المنتج</h3>
                    <div className="space-y-4">
                        {options.map((option, index) => (
                            <div key={index} className="flex items-center gap-4 p-3 bg-gray-700/50 rounded-md">
                                <input
                                    type="text"
                                    placeholder="اسم الخيار (مثال: اللون)"
                                    value={option.name}
                                    onChange={(e) => handleOptionNameChange(index, e.target.value)}
                                    className="flex-1 border-gray-600 bg-gray-700 text-gray-100 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm placeholder-gray-400"
                                />
                                <input
                                    type="text"
                                    placeholder="القيم (مفصولة بفاصلة، مثال: أحمر,أزرق)"
                                    onChange={(e) => handleOptionValuesChange(index, e.target.value)}
                                    className="flex-1 border-gray-600 bg-gray-700 text-gray-100 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm placeholder-gray-400"
                                />
                                <button type="button" onClick={() => removeOptionField(index)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/50 rounded-full transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={addOptionField} className="text-sm font-medium text-pink-400 hover:text-pink-300">
                            + إضافة خيار آخر
                        </button>
                    </div>
                </div>

                <div className="text-left pt-4">
                    <button type="submit" className="inline-flex justify-center py-3 px-8 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 w-full md:w-auto transition-all duration-300 transform hover:scale-105">
                        إضافة المنتج
                    </button>
                </div>
            </form>
        </div>
    );
};
