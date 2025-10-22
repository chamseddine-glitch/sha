
import React, { useState, useEffect } from 'react';
import { AddProductForm } from './components/AddProductForm';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { CartModal } from './components/CartModal';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminNotifications } from './components/AdminNotifications';
import { OrderListModal } from './components/OrderListModal';
import { CategoryFilter } from './components/CategoryFilter';
import { Footer } from './components/Footer';
import { ContactSettings } from './components/ContactSettings';
import { CategorySettings } from './components/CategorySettings';
import { EditProductModal } from './components/EditProductModal';
import { ShippingSettings } from './components/ShippingSettings';
import { SocialSettings } from './components/SocialSettings';
import { StoreSettings } from './components/StoreSettings';
import { WhatsAppButton } from './components/WhatsAppButton';
import { Login } from './components/Login';
import { ProductDetailModal } from './components/ProductDetailModal';
import type { Product, CartItem, OrderDetails, PlacedOrder } from './types';
import { useToast } from './contexts/ToastContext';

const App: React.FC = () => {
    const [products, setProducts] = useState<Product[]>(() => {
        const saved = localStorage.getItem('products');
        if (saved) {
            return JSON.parse(saved);
        }
        return [
            {
                id: '1',
                name: 'سماعات أذن لاسلكية برو',
                description: 'صوت غامر، إلغاء نشط للضوضاء، وملاءمة مريحة للاستماع طوال اليوم.',
                price: 12500,
                imageUrls: [
                    'https://picsum.photos/seed/earbuds/400/300',
                    'https://picsum.photos/seed/earbuds2/400/300',
                    'https://picsum.photos/seed/earbuds3/400/300'
                ],
                category: 'إلكترونيات',
                options: [
                    { name: 'اللون', values: ['أسود ليلي', 'أبيض لؤلؤي', 'أزرق محيطي'] },
                    { name: 'الضمان', values: ['سنة واحدة', 'سنتان (+500 دج)'] }
                ]
            },
            {
                id: '2',
                name: 'ساعة ذكية Series 7',
                description: 'تتبع لياقتك، ابق على اتصال، وخصص واجهة ساعتك. تجربة الساعة الذكية المثالية.',
                price: 38000,
                imageUrls: ['https://picsum.photos/seed/watch/400/300'],
                category: 'اكسسوارات',
                options: [
                    { name: 'الحجم', values: ['41 مم', '45 مم'] },
                    { name: 'لون السوار', values: ['أسود', 'فضي', 'ذهبي'] }
                ]
            },
            {
                id: '3',
                name: 'باور بانك محمول 20000mAh',
                description: 'شحن سريع وسعة عالية للحفاظ على شحن أجهزتك أثناء التنقل.',
                price: 5500,
                imageUrls: ['https://picsum.photos/seed/powerbank/400/300'],
                category: 'اكسسوارات'
            }
        ];
    });

    const [isAdminView, setIsAdminView] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get('admin') === 'true';
    });

    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
        return sessionStorage.getItem('isAdminAuthenticated') === 'true';
    });
    
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
    
    // Contact info state
    const [contactPhone, setContactPhone] = useState(() => localStorage.getItem('contactPhone') || '0123 456 789');
    const [contactEmail, setContactEmail] = useState(() => localStorage.getItem('contactEmail') || 'contact@rsure.store');

    // Social media state
    const [facebookUrl, setFacebookUrl] = useState(() => localStorage.getItem('facebookUrl') || 'https://www.facebook.com/profile.php?id=100088265057034');
    const [whatsappNumber, setWhatsappNumber] = useState(() => localStorage.getItem('whatsappNumber') || '213540455225');
    
    // Shipping costs state
    const [homeDeliveryCost, setHomeDeliveryCost] = useState(() => Number(localStorage.getItem('homeDeliveryCost') || 600));
    const [officeDeliveryCost, setOfficeDeliveryCost] = useState(() => Number(localStorage.getItem('officeDeliveryCost') || 400));

    // Category management state
    const [managedCategories, setManagedCategories] = useState<string[]>(() => {
        const saved = localStorage.getItem('managedCategories');
        return saved ? JSON.parse(saved) : ['إلكترونيات', 'اكسسوارات'];
    });

    // Admin order notifications state
    const [placedOrders, setPlacedOrders] = useState<PlacedOrder[]>(() => {
        const saved = localStorage.getItem('placedOrders');
        if (saved) {
            const parsed = JSON.parse(saved) as PlacedOrder[];
            return parsed.map(order => ({
                ...order,
                createdAt: new Date(order.createdAt),
            }));
        }
        return [];
    });

    const [isOrderListOpen, setIsOrderListOpen] = useState(false);
    const [viewedOrderIds, setViewedOrderIds] = useState<Set<string>>(new Set());

    // Product editing and detail view state
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [detailedProduct, setDetailedProduct] = useState<Product | null>(null);
    
    // Filtering and search state
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Store branding state
    const [storeName, setStoreName] = useState(() => localStorage.getItem('storeName') || 'Rsure Store');
    const [logoUrl, setLogoUrl] = useState(() => localStorage.getItem('logoUrl') || "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAHCAcIDASIAAhEBAxEB/8QAGwABAQACAwEAAAAAAAAAAAAAAAEFBgIDBAf/xAAzEAEAAQIDBgUEAwEBAAACCwEAAQIRAyExQVFh8BJxgZEiMoGhscHRFELh8SMkQlJi/8QAGAEBAQEBAQAAAAAAAAAAAAAAAAECAwT/xAAhEQEBAQEAAgMBAQEBAQAAAAAAARECEiEDMUETIlFh/9oADAMBAAIRAxEAPwD9xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA-");

    const { addToast } = useToast();
// Fix: Corrected typo from `_const` to `const` to properly initialize state.
const [isScrolled, setIsScrolled] = useState(false);

    // Persist state to localStorage
    useEffect(() => { localStorage.setItem('products', JSON.stringify(products)); }, [products]);
    useEffect(() => { localStorage.setItem('contactPhone', contactPhone); }, [contactPhone]);
    useEffect(() => { localStorage.setItem('contactEmail', contactEmail); }, [contactEmail]);
    useEffect(() => { localStorage.setItem('facebookUrl', facebookUrl); }, [facebookUrl]);
    useEffect(() => { localStorage.setItem('whatsappNumber', whatsappNumber); }, [whatsappNumber]);
    useEffect(() => { localStorage.setItem('homeDeliveryCost', String(homeDeliveryCost)); }, [homeDeliveryCost]);
    useEffect(() => { localStorage.setItem('officeDeliveryCost', String(officeDeliveryCost)); }, [officeDeliveryCost]);
    useEffect(() => { localStorage.setItem('managedCategories', JSON.stringify(managedCategories)); }, [managedCategories]);
    useEffect(() => { localStorage.setItem('placedOrders', JSON.stringify(placedOrders)); }, [placedOrders]);
    useEffect(() => { localStorage.setItem('storeName', storeName); }, [storeName]);
    useEffect(() => { localStorage.setItem('logoUrl', logoUrl); }, [logoUrl]);
    
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
        const params = new URLSearchParams(window.location.search);
        const productId = params.get('product');
        if (productId && products.length > 0) {
            const productFromUrl = products.find(p => p.id === productId);
            if (productFromUrl) {
                setDetailedProduct(productFromUrl);
            }
        }
    }, [products]);

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

    const unreadOrderCount = placedOrders.length - viewedOrderIds.size;

    const handleLoginSuccess = () => {
        setIsAdminAuthenticated(true);
        sessionStorage.setItem('isAdminAuthenticated', 'true');
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
    
    const handlePlaceOrder = (customerDetails: OrderDetails) => {
        const subtotal = checkoutItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        const shippingCost = customerDetails.shippingMethod === 'home' ? homeDeliveryCost : officeDeliveryCost;
        const totalAmount = subtotal + shippingCost;

        const newOrder: PlacedOrder = {
            id: new Date().toISOString(),
            createdAt: new Date(),
            customer: customerDetails,
            items: checkoutItems,
            totalAmount: totalAmount,
        };

        setPlacedOrders(prev => [newOrder, ...prev]);
        addToast('تم تأكيد طلبك بنجاح! سيتم الاتصال بك قريباً.', 'success');
        
        if (checkoutItems === cartItems) {
            setCartItems([]);
        }

        setIsCheckoutOpen(false);
        setCheckoutItems([]);
    };
    
    const handleOpenOrderList = () => {
        setIsOrderListOpen(true);
        const allOrderIds = new Set(placedOrders.map(o => o.id));
        setViewedOrderIds(allOrderIds);
    };

    const handleClearOrders = () => {
        setPlacedOrders([]);
        setViewedOrderIds(new Set());
        setIsOrderListOpen(false);
        addToast('تم مسح جميع الإشعارات.', 'info');
    };

    const handleAddCategory = (newCategory: string) => {
        setManagedCategories(prev => [...prev, newCategory]);
        addToast(`تمت إضافة الفئة "\${newCategory}" بنجاح!`, 'success');
    };

    const handleDeleteCategory = (categoryToDelete: string) => {
        setManagedCategories(prev => prev.filter(c => c !== categoryToDelete));
        addToast(`تم حذف الفئة "\${categoryToDelete}".`, 'info');
    };

    const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const displayCategories = ['all', ...managedCategories];
    
    const filteredProducts = products
        .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
        .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const showAdminContent = isAdminView && isAdminAuthenticated;

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
                                        <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `\${index * 75}ms` }}>
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
                    onClose={() => setIsCheckoutOpen(false)}
                    onConfirmOrder={handlePlaceOrder}
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
                        notificationCount={unreadOrderCount} 
                        onClick={handleOpenOrderList}
                    />
                    {isOrderListOpen && (
                        <OrderListModal 
                            orders={placedOrders} 
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
