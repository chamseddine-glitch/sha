import React from 'react';

interface ContactSettingsProps {
    phone: string;
    email: string;
    onPhoneChange: (phone: string) => void;
    onEmailChange: (email: string) => void;
}

export const ContactSettings: React.FC<ContactSettingsProps> = ({ phone, email, onPhoneChange, onEmailChange }) => {
    return (
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 mb-8 mt-8">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">إعدادات التواصل</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-300 mb-1">رقم الهاتف</label>
                    <input 
                        type="tel" 
                        id="contact-phone" 
                        value={phone}
                        onChange={e => onPhoneChange(e.target.value)}
                        className="block w-full border-gray-600 bg-gray-700 text-gray-100 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm placeholder-gray-400" 
                        placeholder="0123 456 789"
                    />
                </div>
                <div>
                    <label htmlFor="contact-email" className="block text-sm font-medium text-gray-300 mb-1">البريد الإلكتروني</label>
                    <input 
                        type="email" 
                        id="contact-email" 
                        value={email}
                        onChange={e => onEmailChange(e.target.value)}
                        className="block w-full border-gray-600 bg-gray-700 text-gray-100 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm placeholder-gray-400" 
                        placeholder="contact@rsure.store"
                    />
                </div>
            </div>
        </div>
    );
};
