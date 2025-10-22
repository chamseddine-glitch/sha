import React, { useState } from 'react';
import { useToast } from '../contexts/ToastContext';

const CopyIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
        <path d="M4 3a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V3z" />
    </svg>
);

const XIcon: React.FC = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const PublishSettings: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [exportedData, setExportedData] = useState('');
    const { addToast } = useToast();

    const handlePublish = () => {
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
        
        setExportedData(JSON.stringify(storeData, null, 2));
        setIsModalOpen(true);
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(exportedData).then(() => {
            addToast('تم نسخ البيانات بنجاح!', 'success');
        }, () => {
            addToast('فشل النسخ إلى الحافظة.', 'error');
        });
    };

    return (
        <>
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-red-500/50 mb-8 mt-8">
                <h2 className="text-3xl font-bold text-gray-100 mb-4">نشر التغييرات</h2>
                <p className="text-gray-400 mb-6">
                    لجعل منتجاتك وإعداداتك الجديدة تظهر لجميع زوار الموقع، يجب عليك "نشر" هذه التغييرات. هذا سيقوم بإنشاء نسخة من بيانات متجرك يمكنك إعطائي إياها لتحديث الموقع الأساسي.
                </p>
                <button 
                    onClick={handlePublish}
                    className="w-full inline-flex justify-center py-3 px-8 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-105"
                >
                    نشر التغييرات لتصبح عامة
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-[120] p-4 animate-fade-in" onClick={() => setIsModalOpen(false)}>
                    <div className="relative bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in-scale" onClick={e => e.stopPropagation()}>
                        <div className="p-5 flex justify-between items-center border-b border-gray-700">
                            <h2 className="text-2xl font-bold text-white">بيانات المتجر للنشر</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors"><XIcon /></button>
                        </div>
                        <div className="flex-grow overflow-y-auto p-6 space-y-4">
                            <p className="text-gray-300">لجعل منتجاتك وإعداداتك الجديدة تظهر لجميع الزوار، يرجى اتباع الخطوات التالية:</p>
                            <ol className="list-decimal list-inside text-gray-400 space-y-2 bg-gray-800 p-4 rounded-md">
                                <li>انقر على زر "نسخ البيانات" لنسخ كل النص في المربع أدناه.</li>
                                <li>أغلق هذه النافذة.</li>
                                <li>الصق النص المنسوخ في محادثتنا واطلب مني <strong className="text-pink-400">"تحديث المتجر بهذه البيانات"</strong>.</li>
                            </ol>
                            <div className="relative">
                                <textarea 
                                    readOnly 
                                    value={exportedData}
                                    className="w-full h-64 bg-gray-950 text-gray-300 p-3 rounded-md border border-gray-700 font-mono text-xs"
                                ></textarea>
                                <button onClick={handleCopyToClipboard} className="absolute top-2 right-2 p-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600">
                                    <CopyIcon />
                                </button>
                            </div>
                        </div>
                         <div className="p-4 border-t border-gray-700 flex justify-end">
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="py-2 px-6 text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-500"
                            >
                                إغلاق
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
