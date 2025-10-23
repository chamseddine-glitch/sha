



import React, { useState, useEffect } from 'react';
import { AddProductForm } from './components/AddProductForm';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { CartModal } from './components/CartModal';
import { CheckoutModal } from './components/CheckoutModal';
import { CategoryFilter } from './components/CategoryFilter';
import { Footer } from './components/Footer';
import { ContactSettings } from './components/ContactSettings';
import { CategorySettings } from './components/CategorySettings';
import { EditProductModal } from './components/EditProductModal';
import { ShippingSettings } from './components/ShippingSettings';
import { SocialSettings } from './components/SocialSettings';
import { StoreSettings } from './components/StoreSettings';
import { PublishSettings } from './components/PublishSettings';
import { WhatsAppButton } from './components/WhatsAppButton';
import { Login } from './components/Login';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AdminNotifications } from './components/AdminNotifications';
import { OrderListModal } from './components/OrderListModal';
import type { Product, CartItem, PlacedOrder } from './types';
import { useToast } from './contexts/ToastContext';
import { fetchStoreData, fetchOrders, clearOrders } from './services/storeService';

const SpinnerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


const App: React.FC = () => {
    // State is now initialized with default/fallback values, not from localStorage.
    const [products, setProducts] = useState<Product[]>([
        {
            id: '4',
            name: 'Argivit Tablet - مكمل لزيادة الطول',
            description: 'مكمل غذائي غني بالفيتامينات والمعادن والأرجينين لتعزيز النمو وزيادة الطول لدى الأطفال والمراهقين.',
            price: 3500,
            imageUrls: ['https://i.ibb.co/L5w29mH/image.png'],
            category: 'مكملات غذائية',
        }
    ]);
    const [isLoading, setIsLoading] = useState(true);

    const [isAdminView, setIsAdminView] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get('admin') === 'true';
    });

    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
        return sessionStorage.getItem('isAdminAuthenticated') === 'true';
    });
    
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        const saved = localStorage.getItem('cartItems');
        return saved ? JSON.parse(saved) : [];
    });

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
    
    const [contactPhone, setContactPhone] = useState('0674818469');
    const [contactEmail, setContactEmail] = useState('chamseddinenouah@gmail.com');
    const [facebookUrl, setFacebookUrl] = useState('https://www.facebook.com/profile.php?id=100088265057034');
    const [whatsappNumber, setWhatsappNumber] = useState('213674818469');
    const [homeDeliveryCost, setHomeDeliveryCost] = useState(600);
    const [officeDeliveryCost, setOfficeDeliveryCost] = useState(400);
    const [managedCategories, setManagedCategories] = useState<string[]>(['إلكترونيات', 'اكسسوارات', 'مكملات غذائية']);
    const [storeName, setStoreName] = useState('Rsure Store');
    const [logoUrl, setLogoUrl] = useState("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAHCAcIDASIAAhEBAxEB/8QAGwABAQACAwEAAAAAAAAAAAAAAAEFBgIDBAf/xAAzEAEAAQIDBgUEAwEBAAACCwEAAQIRAyExQVFh8BJxgZEiMoGhscHRFELh8SMkQlJi/8QAGAEBAQEBAQAAAAAAAAAAAAAAAAECAwT/xAAhEQEBAQEAAgMBAQEBAQAAAAAAARECEiEDMUETIlFh/9oADAMBAAIRAxEAPwD9xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA-");
    
    // Admin orders state
    const [orders, setOrders] = useState<PlacedOrder[]>([]);
    const [newOrderCount, setNewOrderCount] = useState(0);
    const [isOrderListOpen, setIsOrderListOpen] = useState(false);

    // Product editing and detail view state
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [detailedProduct, setDetailedProduct] = useState<Product | null>(null);
    
    // Filtering and search state
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const [isScrolled, setIsScrolled] = useState(false);
    const { addToast } = useToast();

    // Persist state to localStorage (for admin's draft state)
    useEffect(() => { if(isAdminView) localStorage.setItem('products', JSON.stringify(products)); }, [products, isAdminView]);
    useEffect(() => { if(isAdminView) localStorage.setItem('contactPhone', contactPhone); }, [contactPhone, isAdminView]);
    useEffect(() => { if(isAdminView) localStorage.setItem('contactEmail', contactEmail); }, [contactEmail, isAdminView]);
    useEffect(() => { if(isAdminView) localStorage.setItem('facebookUrl', facebookUrl); }, [facebookUrl, isAdminView]);
    useEffect(() => { if(isAdminView) localStorage.setItem('whatsappNumber', whatsappNumber); }, [whatsappNumber, isAdminView]);
    useEffect(() => { if(isAdminView) localStorage.setItem('homeDeliveryCost', String(homeDeliveryCost)); }, [homeDeliveryCost, isAdminView]);
    useEffect(() => { if(isAdminView) localStorage.setItem('officeDeliveryCost', String(officeDeliveryCost)); }, [officeDeliveryCost, isAdminView]);
    useEffect(() => { if(isAdminView) localStorage.setItem('managedCategories', JSON.stringify(managedCategories)); }, [managedCategories, isAdminView]);
    useEffect(() => { if(isAdminView) localStorage.setItem('storeName', storeName); }, [storeName, isAdminView]);
    useEffect(() => { if(isAdminView) localStorage.setItem('logoUrl', logoUrl); }, [logoUrl, isAdminView]);
    
    // Cart is independent of admin view and always uses localStorage
    useEffect(() => { localStorage.setItem('cartItems', JSON.stringify(cartItems)); }, [cartItems]);
    
    // Effect to load store data from the cloud service on initial load.
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                // Fetch store settings
                const settingsData = await fetchStoreData();
                const useLocalData = isAdminView && localStorage.getItem('products');

                if (useLocalData) {
                    // Admin has local changes (draft state), so load from localStorage.
                    setProducts(JSON.parse(localStorage.getItem('products')!));
                    setStoreName(localStorage.getItem('storeName') || 'Rsure Store');
                    setLogoUrl(localStorage.getItem('logoUrl') || '');
                    setContactPhone(localStorage.getItem('contactPhone') || '');
                    setContactEmail(localStorage.getItem('contactEmail') || '');
                    setFacebookUrl(localStorage.getItem('facebookUrl') || '');
                    setWhatsappNumber(localStorage.getItem('whatsappNumber') || '');
                    setHomeDeliveryCost(Number(localStorage.getItem('homeDeliveryCost') || 600));
                    setOfficeDeliveryCost(Number(localStorage.getItem('officeDeliveryCost') || 400));
                    setManagedCategories(JSON.parse(localStorage.getItem('managedCategories') || '[]'));
                } else if (settingsData) {
                    // Public user, or admin with no local changes. Load from remote.
                    setProducts(settingsData.products || []);
                    setStoreName(settingsData.storeName || 'Rsure Store');
                    setLogoUrl(settingsData.logoUrl || '');
                    setContactPhone(settingsData.contactPhone || '');
                    setContactEmail(settingsData.contactEmail || '');
                    setFacebookUrl(settingsData.facebookUrl || '');
                    setWhatsappNumber(settingsData.whatsappNumber || '');
                    setHomeDeliveryCost(settingsData.homeDeliveryCost || 600);
                    setOfficeDeliveryCost(settingsData.officeDeliveryCost || 400);
                    setManagedCategories(settingsData.managedCategories || []);
                    
                    // If admin, populate their localStorage so they can start editing.
                    if (isAdminView) {
                        localStorage.setItem('products', JSON.stringify(settingsData.products || []));
                        localStorage.setItem('storeName', settingsData.storeName || 'Rsure Store');
                        localStorage.setItem('logoUrl', settingsData.logoUrl || '');
                        localStorage.setItem('contactPhone', settingsData.contactPhone || '');
                        localStorage.setItem('contactEmail', settingsData.contactEmail || '');
                        localStorage.setItem('facebookUrl', settingsData.facebookUrl || '');
                        localStorage.setItem('whatsappNumber', settingsData.whatsappNumber || '');
                        localStorage.setItem('homeDeliveryCost', String(settingsData.homeDeliveryCost || 600));
                        localStorage.setItem('officeDeliveryCost', String(settingsData.officeDeliveryCost || 400));
                        localStorage.setItem('managedCategories', JSON.stringify(settingsData.managedCategories || []));
                    }
                }

                // Fetch orders for admin view
                if (isAdminView && (sessionStorage.getItem('isAdminAuthenticated') === 'true')) {
                    const fetchedOrders = await fetchOrders();
                    setOrders(fetchedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
                    
                    // Calculate new order count for notifications
                    const seenCount = parseInt(localStorage.getItem('seenOrderCount') || '0', 10);
                    const newCount = fetchedOrders.length - seenCount;
                    setNewOrderCount(newCount > 0 ? newCount : 0);
                }

            } catch (error) {
                console.error("Failed to load store data:", error);
                addToast('فشل تحميل بيانات المتجر. قد ترى نسخة قديمة.', 'error');
                // Fallback to local data for admin if network fails
                if (isAdminView && localStorage.getItem('products')) {
                    setProducts(JSON.parse(localStorage.getItem('products')!));
                }
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [isAdminView, isAdminAuthenticated]);


    // Header scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle opening product modal from URL on initial load
    useEffect(() => {
        if (isLoading) return; // Wait until data is loaded
        const params = new URLSearchParams(window.location.search);
        const productId = params.get('product');
        if (productId && products.length > 0) {
            const productFromUrl = products.find(p => p.id === productId);
            if (productFromUrl) {
                setDetailedProduct(productFromUrl);
            }
        }
    }, [products, isLoading]);

    // Handle browser back/forward buttons for product modal
    useEffect(() => {
        const handlePopState = () => {
            const params = new URLSearchParams(window.location.search);
            const productId = params.get('product');
            if (productId) {
                const productFromUrl = products.find(p => p.id === productId);
                if (productFromUrl) {
                    setDetailedProduct(productFromUrl);
                }
            } else {
                setDetailedProduct(null);
            }
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [products]);

    const handleLoginSuccess = () => {
        setIsAdminAuthenticated(true);
        sessionStorage.setItem('isAdminAuthenticated', 'true');
    };

    const handleOpenOrderList = () => {
        setIsOrderListOpen(true);
        setNewOrderCount(0);
        localStorage.setItem('seenOrderCount', String(orders.length));
    };

    const handleClearOrders = async () => {
        try {
            await clearOrders();
            setOrders([]);
            localStorage.setItem('seenOrderCount', '0');
            addToast('تم مسح جميع الإشعارات بنجاح.', 'success');
            setIsOrderListOpen(false);
        } catch (error) {
            addToast('فشل في مسح الإشعارات.', 'error');
        }
    };

    const handleAddProduct = (product: Omit<Product, 'id'>) => {
        const newProduct: Product = { ...product, id: new Date().toISOString() };
        setProducts(prevProducts => [newProduct, ...prevProducts]);
        addToast('تمت إضافة المنتج بنجاح!', 'success');
    };

    const handleDeleteProduct = (productId: string) => {
        setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
        addToast('تم حذف المنتج.', 'info');
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
    };

    const handleUpdateProduct = (updatedProduct: Product) => {
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
        setEditingProduct(null);
        addToast('تم تحديث المنتج بنجاح!', 'success');
    };

    const handleViewDetails = (product: Product) => {
        setDetailedProduct(product);
        const url = new URL(window.location.href);
        url.searchParams.set('product', product.id);
        window.history.pushState({ productId: product.id }, '', url);
    };

    const handleCloseDetails = () => {
        setDetailedProduct(null);
        const url = new URL(window.location.href);
        url.searchParams.delete('product');
        window.history.pushState({}, '', url);
    };
    
    const handleAddToCart = (item: Omit<CartItem, 'id'>) => {
        const newItem = { ...item, id: new Date().toISOString() };
        setCartItems(prev => [...prev, newItem]);
        addToast('تمت الإضافة إلى السلة!', 'success');
    };

    const handleBuyNow = (item: Omit<CartItem, 'id'>) => {
        const newItem = { ...item, id: new Date().toISOString() };
        setCheckoutItems([newItem]);
        setIsCheckoutOpen(true);
    };

    const handleRemoveFromCart = (itemId: string) => {
        setCartItems(prev => prev.filter(item => item.id !== itemId));
        addToast('تمت إزالة المنتج من السلة.', 'info');
    };
    
    const handleAddCategory = (newCategory: string) => {
        setManagedCategories(prev => [...prev, newCategory]);
        addToast(`تمت إضافة الفئة "${newCategory}" بنجاح!`, 'success');
    };

    const handleDeleteCategory = (categoryToDelete: string) => {
        setManagedCategories(prev => prev.filter(c => c !== categoryToDelete));
        addToast(`تم حذف الفئة "${categoryToDelete}".`, 'info');
    };

    const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const displayCategories = ['all', ...managedCategories];
    
    const filteredProducts = products
        .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
        .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const showAdminContent = isAdminView && isAdminAuthenticated;

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-200">
                <SpinnerIcon className="h-12 w-12 text-pink-500" />
                <p className="mt-4 text-lg">جاري تحميل بيانات المتجر...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-gray-200 flex flex-col">
            <Header 
                isAdminView={showAdminContent} 
                cartItemCount={totalCartItems}
                onCartClick={() => setIsCartOpen(true)}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                storeName={storeName}
                logoUrl={logoUrl}
                isScrolled={isScrolled}
            />
            <main className="container mx-auto p-4 md:p-8 flex-grow">
                <div className="max-w-4xl mx-auto">
                    {isAdminView ? (
                        showAdminContent ? (
                            <>
                                <div className="bg-gray-800/50 border border-purple-500/30 p-4 rounded-lg mb-8 text-center">
                                    <h2 className="text-xl font-bold text-gray-100">أهلاً بك في لوحة التحكم</h2>
                                    <p className="text-sm text-gray-400 mt-1">
                                        لقد قمت بتسجيل الدخول كمدير.
                                    </p>
                                </div>
                                <PublishSettings />
                                <StoreSettings
                                    storeName={storeName}
                                    logoUrl={logoUrl}
                                    onStoreNameChange={setStoreName}
                                    onLogoUrlChange={setLogoUrl}
                                />
                                <AddProductForm onAddProduct={handleAddProduct} categories={managedCategories} />
                                <ShippingSettings
                                    homeCost={homeDeliveryCost}
                                    officeCost={officeDeliveryCost}
                                    onHomeCostChange={setHomeDeliveryCost}
                                    onOfficeCostChange={setOfficeDeliveryCost}
                                />
                                <CategorySettings 
                                    categories={managedCategories}
                                    onAddCategory={handleAddCategory}
                                    onDeleteCategory={handleDeleteCategory}
                                />
                                <ContactSettings
                                    phone={contactPhone}
                                    email={contactEmail}
                                    onPhoneChange={setContactPhone}
                                    onEmailChange={setContactEmail}
                                />
                                <SocialSettings
                                    facebook={facebookUrl}
                                    whatsapp={whatsappNumber}
                                    onFacebookChange={setFacebookUrl}
                                    onWhatsappChange={setWhatsappNumber}
                                />
                            </>
                        ) : (
                            <Login onLoginSuccess={handleLoginSuccess} />
                        )
                    ) : (
                        <CategoryFilter
                            categories={displayCategories}
                            selectedCategory={selectedCategory}
                            onSelectCategory={setSelectedCategory}
                        />
                    )}
                    
                    {(!isAdminView || showAdminContent) && (
                         <div className="mt-8">
                             <h2 className="text-4xl font-extrabold text-gray-100 mb-6 pb-3 border-b-2 border-gray-700 relative">
                               <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
                                    {showAdminContent ? 'منتجاتك' : 'منتجاتنا'}
                               </span>
                            </h2>
                            {filteredProducts.length > 0 ? (
                                <div key={selectedCategory + searchQuery} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {filteredProducts.map((product, index) => (
                                        <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 75}ms` }}>
                                            <ProductCard 
                                                product={product} 
                                                onDelete={handleDeleteProduct}
                                                onAddToCart={handleAddToCart}
                                                onBuyNow={handleBuyNow}
                                                onEdit={handleEditProduct}
                                                isAdminView={showAdminContent} 
                                                onViewDetails={handleViewDetails}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                 <div className="text-center py-16 px-6 bg-gray-800 rounded-lg shadow-md border border-gray-700">
                                    <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <h3 className="mt-2 text-xl font-medium text-gray-100">لا توجد نتائج</h3>
                                    <p className="mt-1 text-gray-400">
                                        {showAdminContent ? "أضف بعض المنتجات لعرضها هنا." : "حاول تغيير الفئة أو مصطلح البحث."}
                                     </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
            
            <Footer 
                phone={contactPhone} 
                email={contactEmail} 
                facebookUrl={facebookUrl}
                whatsappNumber={whatsappNumber}
            />

            {isCartOpen && (
                <CartModal
                    items={cartItems}
                    onClose={() => setIsCartOpen(false)}
                    onRemoveItem={handleRemoveFromCart}
                    onCheckout={() => {
                        if (cartItems.length > 0) {
                            setCheckoutItems(cartItems);
                            setIsCartOpen(false);
                            setIsCheckoutOpen(true);
                        } else {
                            addToast('سلّتك فارغة!', 'info');
                        }
                    }}
                />
            )}

            {isCheckoutOpen && (
                <CheckoutModal
                    items={checkoutItems}
                    onClose={() => {
                        setIsCheckoutOpen(false);
                        setCartItems([]);
                    }}
                    homeDeliveryCost={homeDeliveryCost}
                    officeDeliveryCost={officeDeliveryCost}
                />
            )}

            {editingProduct && (
                 <EditProductModal
                    product={editingProduct}
                    categories={managedCategories}
                    onClose={() => setEditingProduct(null)}
                    onUpdate={handleUpdateProduct}
                />
            )}

            {detailedProduct && (
                <ProductDetailModal
                    product={detailedProduct}
                    onClose={handleCloseDetails}
                    onAddToCart={(item) => {
                        handleAddToCart(item);
                        handleCloseDetails();
                    }}
                    onBuyNow={(item) => {
                        handleBuyNow(item);
                        handleCloseDetails();
                    }}
                />
            )}

            {showAdminContent && (
                <>
                    <AdminNotifications 
                        notificationCount={newOrderCount}
                        onClick={handleOpenOrderList}
                    />
                    {isOrderListOpen && (
                        <OrderListModal
                            orders={orders}
                            onClose={() => setIsOrderListOpen(false)}
                            onClear={handleClearOrders}
                        />
                    )}
                </>
            )}

            {!isAdminView && (
                <WhatsAppButton whatsappNumber={whatsappNumber} />
            )}
        </div>
    );
};

export default App;