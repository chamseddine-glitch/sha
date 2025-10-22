
import React from 'react';

interface AdminNotificationsProps {
    notificationCount: number;
    onClick: () => void;
}

const BellIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

export const AdminNotifications: React.FC<AdminNotificationsProps> = ({ notificationCount, onClick }) => {
    return (
        <button 
            onClick={onClick}
            className="fixed bottom-6 right-6 z-[100] w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white flex items-center justify-center shadow-lg hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-pink-500 transition-transform transform"
            aria-label={`لديك ${notificationCount} طلبات جديدة`}
        >
            <BellIcon />
            {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform bg-red-600 rounded-full">
                    {notificationCount}
                </span>
            )}
        </button>
    );
};
