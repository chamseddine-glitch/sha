import React, { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { publishStoreData } from '../services/storeService';

const SpinnerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export const PublishSettings: React.FC = () => {
    const { addToast } = useToast();
    const [isPublishing, setIsPublishing] = useState(false);

    const handlePublish = async () => {
        setIsPublishing(true);
        try {
            // Gather all data from localStorage, which represents the admin's current draft.
            const storeData = {
                products: JSON.parse(localStorage.getItem('products') || '[]'),
                contactPhone: localStorage.getItem('contactPhone') || '',
                contactEmail: localStorage.getItem('contactEmail') || '',
                facebookUrl: localStorage.getItem('facebookUrl') || '',
                whatsappNumber: localStorage.getItem('whatsappNumber') || '',
                homeDeliveryCost: Number(localStorage.getItem('homeDeliveryCost') || '0'),
                officeDeliveryCost: Number(localStorage.getItem('officeDeliveryCost') || '0'),
                managedCategories: JSON.parse(localStorage.getItem('managedCategories') || '[]'),
                storeName: localStorage.getItem('storeName') || '',
                logoUrl: localStorage.getItem('logoUrl') || '',
            };

            // Call the service to send the data to the cloud.
            await publishStoreData(storeData);
            
            addToast('تم نشر التغييرات بنجاح! موقعك الآن محدّث للجميع.', 'success');

        } catch (error) {
            const errorMessage = (error as Error).message || 'حدث خطأ أثناء نشر التغييرات. يرجى المحاولة مرة أخرى.';
            console.error("Failed to publish store data:", error);
            addToast(errorMessage, 'error');
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-red-500/50 mb-8 mt-8">
            <h2 className="text-3xl font-bold text-gray-100 mb-4">نشر التغييرات</h2>
            <p className="text-gray-400 mb-6">
                هذه هي أهم خطوة! لجعل تعديلاتك تظهر لجميع زوار الموقع، اضغط على الزر أدناه. سيتم تحديث الموقع فوراً بالمنتجات والإعدادات الجديدة.
            </p>
            <button 
                onClick={handlePublish}
                disabled={isPublishing}
                className="w-full inline-flex justify-center items-center py-3 px-8 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isPublishing ? (
                    <>
                        <SpinnerIcon className="h-5 w-5 ml-3" />
                        جاري النشر...
                    </>
                ) : (
                    'نشر التغييرات الآن'
                )}
            </button>
        </div>
    );
};