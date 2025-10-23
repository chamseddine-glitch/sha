import React from 'react';

interface ShippingSettingsProps {
    homeCost: number;
    officeCost: number;
    onHomeCostChange: (cost: number) => void;
    onOfficeCostChange: (cost: number) => void;
}

export const ShippingSettings: React.FC<ShippingSettingsProps> = ({ homeCost, officeCost, onHomeCostChange, onOfficeCostChange }) => {
    return (
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 mb-8 mt-8">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">إعدادات التوصيل</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="office-shipping-cost" className="block text-sm font-medium text-gray-300 mb-1">سعر التوصيل للمكتب (دج)</label>
                    <input 
                        type="number" 
                        id="office-shipping-cost" 
                        value={officeCost}
                        onChange={e => onOfficeCostChange(Number(e.target.value))}
                        className="block w-full border-gray-600 bg-gray-700 text-gray-100 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm placeholder-gray-400" 
                        placeholder="مثال: 400"
                    />
                </div>
                <div>
                    <label htmlFor="home-shipping-cost" className="block text-sm font-medium text-gray-300 mb-1">سعر التوصيل للمنزل (دج)</label>
                    <input 
                        type="number" 
                        id="home-shipping-cost" 
                        value={homeCost}
                        onChange={e => onHomeCostChange(Number(e.target.value))}
                        className="block w-full border-gray-600 bg-gray-700 text-gray-100 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm placeholder-gray-400" 
                        placeholder="مثال: 600"
                    />
                </div>
            </div>
             <p className="text-xs text-gray-400 mt-4">يمكنك تفعيل التوصيل المجاني عن طريق وضع السعر 0.</p>
        </div>
    );
};