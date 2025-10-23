
import React from 'react';

interface HeaderProps {
    isAdminView: boolean;
    cartItemCount: number;
    onCartClick: () => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    storeName: string;
    logoUrl: string;
    isScrolled: boolean;
}

const VisitorIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
    </svg>
);

const CartIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

export const Header: React.FC<HeaderProps> = ({ isAdminView, cartItemCount, onCartClick, searchQuery, onSearchChange, storeName, logoUrl, isScrolled }) => {
    return (
        <header className="bg-gray-950/80 backdrop-blur-lg sticky top-0 z-50 transition-all duration-300">
            {/* Big store name section, visible only at top */}
            <div
                className={`
                    text-center border-b border-gray-800
                    transition-all duration-300 ease-in-out
                    ${isScrolled ? 'max-h-0 py-0 opacity-0 invisible' : 'max-h-40 py-6 opacity-100 visible'}
                `}
                aria-hidden={isScrolled}
            >
                <a href="/" className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
                    {storeName}
                </a>
            </div>

            {/* Sticky bar */}
            <div className={`container mx-auto px-4 md:px-8 transition-all duration-300 border-b ${isScrolled ? 'border-gray-800 shadow-lg' : 'border-transparent'}`}>
                <div className="flex items-center justify-between gap-4 py-3">
                    <div className="flex items-center space-x-3 flex-shrink-0">
                        {logoUrl ? (
                            <img src={logoUrl} alt="Store Logo" className={`object-cover rounded-md transition-all duration-300 ${isScrolled ? 'h-10 w-10' : 'h-12 w-12'}`} />
                        ) : (
                            <div className={`bg-gray-700 rounded-md transition-all duration-300 ${isScrolled ? 'h-10 w-10' : 'h-12 w-12'}`}></div>
                        )}
                    </div>

                    {/* Middle part: Search or empty space for alignment */}
                    {!isAdminView ? (
                        <div className="flex-1 max-w-lg mx-4">
                            <div className="relative">
                                {/* Search Icon */}
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                {/* Search Input */}
                                <input
                                    type="text"
                                    placeholder="ابحث عن منتج..."
                                    value={searchQuery}
                                    onChange={(e) => onSearchChange(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-600 bg-gray-700/50 text-gray-100 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm placeholder-gray-400"
                                />
                            </div>
                        </div>
                    ) : (
                        // In admin view, we just need space to push the right-side button to the end
                        <div className="flex-1"></div>
                    )}
                    
                    {/* Right side Icons */}
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {!isAdminView && (
                            <button 
                                onClick={onCartClick}
                                className="relative p-2 rounded-full text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 transition-colors"
                                aria-label="Open cart"
                            >
                                <CartIcon />
                                {cartItemCount > 0 && (
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                                        {cartItemCount}
                                    </span>
                                )}
                            </button>
                        )}
                       
                        {isAdminView && (
                             <a 
                                href="/"
                                className="flex items-center justify-center px-3 sm:px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 transition-all duration-200"
                            >
                                <VisitorIcon />
                                <span className="hidden sm:inline">عرض المتجر</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};