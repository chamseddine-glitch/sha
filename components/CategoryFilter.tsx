import React from 'react';

interface CategoryFilterProps {
    categories: string[];
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
}

const categoryTranslations: { [key: string]: string } = {
    'all': 'الكل',
    'إلكترونيات': 'إلكترونيات',
    'اكسسوارات': 'اكسسوارات'
};


export const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selectedCategory, onSelectCategory }) => {
    return (
        <div className="mb-8">
            <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-300 mr-4">الفئات:</h3>
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => onSelectCategory(category)}
                        className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                            selectedCategory === category
                                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                        {categoryTranslations[category] || category}
                    </button>
                ))}
            </div>
        </div>
    );
};
