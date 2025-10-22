
import React from 'react';

interface StoreSettingsProps {
    storeName: string;
    logoUrl: string;
    onStoreNameChange: (name: string) => void;
    onLogoUrlChange: (url: string) => void;
}

export const StoreSettings: React.FC<StoreSettingsProps> = ({ storeName, logoUrl, onStoreNameChange, onLogoUrlChange }) => {
    
    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                onLogoUrlChange(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 mb-8">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">إعدادات المتجر</h2>
            <div className="space-y-6">
                <div>
                    <label htmlFor="store-name" className="block text-sm font-medium text-gray-300 mb-1">اسم المتجر</label>
                    <input 
                        type="text" 
                        id="store-name" 
                        value={storeName}
                        onChange={e => onStoreNameChange(e.target.value)}
                        className="block w-full border-gray-600 bg-gray-700 text-gray-100 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm placeholder-gray-400" 
                        placeholder="أدخل اسم متجرك"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">شعار المتجر</label>
                    <div className="mt-1 flex items-center gap-4">
                         <span className="inline-block h-16 w-16 rounded-md overflow-hidden bg-gray-700">
                           {logoUrl ? (
                                <img src={logoUrl} alt="Store Logo Preview" className="h-full w-full object-cover" />
                           ) : (
                                <svg className="h-full w-full text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 20.993V24H0v-2.993A1 1 0 001 18h22a1 1 0 001-1.007zM13 13.007V15h-2v-1.993A2 2 0 009 11H7a2 2 0 00-2 2v3a1 1 0 001 1h10a1 1 0 001-1v-3a2 2 0 00-2-2h-2a2 2 0 00-2 2.007z" />
                                </svg>
                           )}
                        </span>
                        <label htmlFor="logo-upload" className="relative cursor-pointer bg-gray-600 py-2 px-3 border border-gray-500 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-200 hover:bg-gray-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-800 focus-within:ring-pink-500">
                           <span>تغيير الشعار</span>
                           <input id="logo-upload" name="logo-upload" type="file" className="sr-only" onChange={handleLogoChange} accept="image/*" />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};
