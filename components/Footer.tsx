
import React from 'react';

const PhoneIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
    </svg>
);

const MailIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
    </svg>
);

const FacebookIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
    </svg>
);

const WhatsAppIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95l-1.4 5.09 5.23-1.38c1.45.79 3.08 1.21 4.76 1.21h.01c5.46 0 9.91-4.45 9.91-9.91s-4.45-9.91-9.91-9.91zm0 18.23c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31c-.82-1.31-1.26-2.83-1.26-4.41 0-4.54 3.7-8.23 8.24-8.23 2.22 0 4.28.86 5.82 2.41 1.54 1.54 2.41 3.6 2.41 5.82-.01 4.54-3.7 8.24-8.24 8.24zm4.52-6.2c-.25-.12-1.47-.72-1.7-.85-.23-.12-.39-.18-.56.18-.17.37-.64.85-.79 1.02-.15.17-.29.18-.54.06-.25-.12-1.07-.39-2.04-1.26-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.44.12-.15.17-.25.25-.41.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.42h-.5c-.17 0-.44.06-.66.31-.22.25-.85.83-.85 2.02s.87 2.34 1 2.51c.12.17 1.71 2.62 4.14 3.63.59.25 1.05.4 1.41.51.6.18 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.12-.22-.18-.47-.3z"/>
    </svg>
);

interface FooterProps {
    phone: string;
    email: string;
    facebookUrl: string;
    whatsappNumber: string;
}

export const Footer: React.FC<FooterProps> = ({ phone, email, facebookUrl, whatsappNumber }) => {
    return (
        <footer className="bg-gray-950/50 border-t border-gray-800 mt-12">
            <div className="container mx-auto px-4 md:px-8 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center text-center gap-6">
                    <p className="text-gray-400 text-sm order-3 md:order-1">
                        &copy; {new Date().getFullYear()} Rsure Store. جميع الحقوق محفوظة.
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 order-2">
                        <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center text-gray-300 hover:text-pink-400 transition-colors">
                            <PhoneIcon />
                            <span>الهاتف</span>
                        </a>
                        <a href={`mailto:${email}`} className="flex items-center text-gray-300 hover:text-cyan-400 transition-colors">
                            <MailIcon />
                            <span>البريد</span>
                        </a>
                        <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-300 hover:text-blue-500 transition-colors">
                            <FacebookIcon />
                            <span>فيسبوك</span>
                        </a>
                         <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-300 hover:text-green-500 transition-colors">
                            <WhatsAppIcon />
                            <span>واتساب</span>
                        </a>
                    </div>
                     <div className="flex flex-col items-center order-1 md:order-3">
                        <h3 className="text-lg font-semibold text-gray-200">تواصل معنا</h3>
                        <p className="text-xs text-gray-500 mt-1">by shamsou N'h</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};
