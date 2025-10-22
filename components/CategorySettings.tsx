import React, { useState } from 'react';
import { useToast } from '../contexts/ToastContext';

interface CategorySettingsProps {
    categories: string[];
    onAddCategory: (category: string) => void;
    onDeleteCategory: (category: string) => void;
}

const DeleteIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
    </svg>
);

export const CategorySettings: React.FC<CategorySettingsProps> = ({ categories, onAddCategory, onDeleteCategory }) => {
    const [newCategory, setNewCategory] = useState('');
    const { addToast } = useToast();

    const handleAdd = () => {
        if (!newCategory.trim()) {
            addToast('اسم الفئة لا يمكن أن يكون فارغًا.', 'error');
            return;
        }
        if (categories.some(c => c.toLowerCase() === newCategory.trim().toLowerCase())) {
            addToast('هذه الفئة موجودة بالفعل.', 'error');
            return;
        }
        onAddCategory(newCategory.trim());
        setNewCategory('');
    };

    return (
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 mb-8 mt-8">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">إدارة الفئات</h2>
            <div className="space-y-4">
                <div className="flex gap-4">
                    <input 
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="block w-full border-gray-600 bg-gray-700 text-gray-100 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm placeholder-gray-400"
                        placeholder="أدخل اسم الفئة الجديدة"
                    />
                    <button
                        onClick={handleAdd}
                        className="px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-pink-500 whitespace-nowrap"
                    >
                        إضافة فئة
                    </button>
                </div>
                <div className="border-t border-gray-700 pt-4">
                    <h3 className="text-lg font-medium text-gray-300 mb-3">الفئات الحالية:</h3>
                    {categories.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                            {categories.map(category => (
                                <div key={category} className="flex items-center gap-2 bg-gray-700/50 py-1.5 px-3 rounded-full">
                                    <span className="text-gray-200 text-sm">{category}</span>
                                    <button 
                                        onClick={() => onDeleteCategory(category)}
                                        className="p-1 bg-gray-900/50 rounded-full text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                                        aria-label={`حذف فئة ${category}`}
                                    >
                                        <DeleteIcon />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-center py-4">لا توجد فئات. أضف واحدة لتبدأ.</p>
                    )}
                </div>
            </div>
        </div>
    );
};
