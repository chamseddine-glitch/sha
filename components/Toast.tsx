
import React, { useEffect, useState } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
}

const icons = {
    success: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    error: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    info: (
         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
};

const typeClasses = {
    success: 'bg-green-800/80 border-green-600 text-green-100',
    error: 'bg-red-800/80 border-red-600 text-red-100',
    info: 'bg-blue-800/80 border-blue-600 text-blue-100',
};

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Start fade in animation
        setIsVisible(true);
        
        // Set timer to start fade out
        const timer = setTimeout(() => {
            setIsVisible(false);
            // Set another timer to call onClose after the fade out transition completes
            setTimeout(onClose, 300);
        }, 3000);

        return () => {
            clearTimeout(timer);
        };
    }, [onClose]);
    
    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    }

    return (
        <div
            className={`flex items-start p-4 rounded-lg shadow-lg border backdrop-blur-md transition-all duration-300 ${typeClasses[type]} ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}
            role="alert"
        >
            <div className="flex-shrink-0">{icons[type]}</div>
            <div className="mr-3 text-sm font-medium">{message}</div>
            <button
                onClick={handleClose}
                className="mr-auto -mx-1.5 -my-1.5 p-1.5 inline-flex h-8 w-8 rounded-lg hover:bg-white/10 focus:ring-2 focus:ring-white/30"
                aria-label="إغلاق"
            >
                <span className="sr-only">إغلاق</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
    );
};