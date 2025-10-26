/**
 * Cart Context
 * Manages shopping cart state and operations
 */
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);

    // Load cart from localStorage based on user
    useEffect(() => {
        if (user) {
            const cartKey = `cart_${user.id}`;
            const saved = localStorage.getItem(cartKey);
            setCartItems(saved ? JSON.parse(saved) : []);
        } else {
            // Guest cart
            const saved = localStorage.getItem('cart_guest');
            setCartItems(saved ? JSON.parse(saved) : []);
        }
    }, [user]);

    // Save to localStorage whenever cart changes
    useEffect(() => {
        if (user) {
            const cartKey = `cart_${user.id}`;
            localStorage.setItem(cartKey, JSON.stringify(cartItems));
        } else {
            localStorage.setItem('cart_guest', JSON.stringify(cartItems));
        }
    }, [cartItems, user]);

    // Add item to cart
    const addToCart = (product, quantity = 1) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id);

            if (existing) {
                // Update quantity if already in cart
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                // Add new item
                return [...prev, { ...product, quantity }];
            }
        });
    };

    // Remove item from cart
    const removeFromCart = (productId) => {
        setCartItems(prev => prev.filter(item => item.id !== productId));
    };

    // Update item quantity
    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setCartItems(prev =>
            prev.map(item =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    // Increase quantity
    const increaseQuantity = (productId) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === productId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    // Decrease quantity
    const decreaseQuantity = (productId) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === productId && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            ).filter(item => item.quantity > 0)
        );
    };

    // Clear cart
    const clearCart = () => {
        setCartItems([]);
    };

    // Check if item is in cart
    const isInCart = (productId) => {
        return cartItems.some(item => item.id === productId);
    };

    // Get item quantity
    const getItemQuantity = (productId) => {
        const item = cartItems.find(item => item.id === productId);
        return item ? item.quantity : 0;
    };

    // Calculate total
    const getCartTotal = () => {
        return cartItems.reduce((total, item) => {
            const price = item.sale_price || item.price;
            return total + (price * item.quantity);
        }, 0);
    };

    // Get total items count
    const getCartItemsCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        isInCart,
        getItemQuantity,
        getCartTotal,
        getCartItemsCount,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

