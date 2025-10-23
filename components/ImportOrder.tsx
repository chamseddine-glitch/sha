import React, { useState } from 'react';
import type { PlacedOrder } from '../types';
import { useToast } from '../contexts/ToastContext';

interface ImportOrderProps {
    onImportOrder: (order: Omit<PlacedOrder, 'id' | 'createdAt'>) => void;
}

export const ImportOrder: React.FC<ImportOrderProps> = ({ onImportOrder }) => {
    const [orderJson, setOrderJson] = useState('');
    const { addToast } = useToast();

    const handleImport = () => {
        if (!orderJson.trim()) {
            addToast('الرجاء لصق بيانات الطلب أولاً.', 'error');
            return;
        }

        try {
            const parsedOrder = JSON.parse(orderJson);
            
            // Basic validation to ensure it looks like an order object
            if (parsedOrder.customer && parsedOrder.items && parsedOrder.totalAmount) {
                onImportOrder(parsedOrder);
                setOrderJson('');
                addToast('تم استيراد الطلب بنجاح!', 'success');
            } else {
                throw new Error('Invalid order structure');
            }
        } catch (error) {
            addToast('بيانات الطلب غير صالحة. الرجاء التأكد من نسخ النص بالكامل.', 'error');
            console.error("Error parsing order JSON:", error);
        }
    };

    return (
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-cyan-500/30 mb-8">
            <h2 className="text-3xl font-bold text-gray-100 mb-4">استيراد طلب جديد</h2>
            <p className="text-gray-400 mb-6">
                عندما يرسل لك زبون بيانات طلبه عبر واتساب، قم بنسخها ولصقها هنا لإضافتها إلى قائمة الطلبات.
            </p>
            <div className="space-y-4">
                <textarea
                    value={orderJson}
                    onChange={(e) => setOrderJson(e.target.value)}
                    rows={6}
                    className="block w-full border-gray-600 bg-gray-900 text-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm placeholder-gray-500 font-mono"
                    placeholder="الصق بيانات الطلب هنا..."
                />
                <button
                    onClick={handleImport}
                    className="w-full inline-flex justify-center py-3 px-8 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-300 transform hover:scale-105"
                >
                    إضافة الطلب
                </button>
            </div>
        </div>
    );
};