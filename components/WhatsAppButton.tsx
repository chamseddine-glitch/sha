
import React from 'react';

interface WhatsAppButtonProps {
    whatsappNumber: string;
}

const WhatsAppIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95l-1.4 5.09 5.23-1.38c1.45.79 3.08 1.21 4.76 1.21h.01c5.46 0 9.91-4.45 9.91-9.91s-4.45-9.91-9.91-9.91zm0 18.23c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31c-.82-1.31-1.26-2.83-1.26-4.41 0-4.54 3.7-8.23 8.24-8.23 2.22 0 4.28.86 5.82 2.41 1.54 1.54 2.41 3.6 2.41 5.82-.01 4.54-3.7 8.24-8.24 8.24zm4.52-6.2c-.25-.12-1.47-.72-1.7-.85-.23-.12-.39-.18-.56.18-.17.37-.64.85-.79 1.02-.15.17-.29.18-.54.06-.25-.12-1.07-.39-2.04-1.26-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.44.12-.15.17-.25.25-.41.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.42h-.5c-.17 0-.44.06-.66.31-.22.25-.85.83-.85 2.02s.87 2.34 1 2.51c.12.17 1.71 2.62 4.14 3.63.59.25 1.05.4 1.41.51.6.18 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.12-.22-.18-.47-.3z"/>
    </svg>
);


export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ whatsappNumber }) => {
    if (!whatsappNumber) return null;

    const link = `https://wa.me/${whatsappNumber}`;

    return (
        <a 
            href={link}
            target="_blank" 
            rel="noopener noreferrer"
            className="fixed bottom-6 left-6 z-[99] w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 transition-transform transform"
            aria-label="تواصل معنا عبر واتساب"
        >
            <WhatsAppIcon />
        </a>
    );
};
