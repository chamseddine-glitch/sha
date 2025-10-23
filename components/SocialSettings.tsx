
import React from 'react';

interface SocialSettingsProps {
    facebook: string;
    whatsapp: string;
    onFacebookChange: (url: string) => void;
    onWhatsappChange: (number: string) => void;
}

export const SocialSettings: React.FC<SocialSettingsProps> = ({ facebook, whatsapp, onFacebookChange, onWhatsappChange }) => {
    return (
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 mb-8 mt-8">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">إعدادات التواصل الاجتماعي</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="facebook-url" className="block text-sm font-medium text-gray-300 mb-1">رابط صفحة الفيسبوك</label>
                    <input 
                        type="url" 
                        id="facebook-url" 
                        value={facebook}
                        onChange={e => onFacebookChange(e.target.value)}
                        className="block w-full border-gray-600 bg-gray-700 text-gray-100 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm placeholder-gray-400" 
                        placeholder="https://facebook.com/yourpage"
                    />
                </div>
                <div>
                    <label htmlFor="whatsapp-number" className="block text-sm font-medium text-gray-300 mb-1">رقم الواتساب</label>
                    <input 
                        type="tel" 
                        id="whatsapp-number" 
                        value={whatsapp}
                        onChange={e => onWhatsappChange(e.target.value)}
                        className="block w-full border-gray-600 bg-gray-700 text-gray-100 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm placeholder-gray-400" 
                        placeholder="مثال: 213540123456"
                    />
                     <p className="text-xs text-gray-400 mt-2">أدخل الرقم مع رمز البلد وبدون علامة "+" أو مسافات.</p>
                </div>
            </div>
        </div>
    );
};
