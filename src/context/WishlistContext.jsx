/**
 * Wishlist Context
 * Manages wishlist/favorites state with backend API
 */
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import wishlistService from '../services/wishlistService';
import { toast } from 'react-hot-toast';

const WishlistContext = createContext();

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within WishlistProvider');
    }
    return context;
};

export const WishlistProvider = ({ children }) => {
    const { user } = useAuth();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch wishlist from backend when user logs in
    useEffect(() => {
        if (user) {
            fetchWishlist();
        } else {
            setWishlistItems([]);
        }
    }, [user]);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const response = await wishlistService.getWishlist();
            
            console.log('Wishlist response:', response); // Debug
            
            // Handle different response structures
            // Backend returns: {success: true, data: {wishlist: [...]}}
            // Service returns: response.data = {success: true, data: {wishlist: [...]}}
            let items = [];
            
            if (response?.data?.wishlist) {
                // Structure: {success: true, data: {wishlist: [...]}}
                items = response.data.wishlist;
            } else if (response?.wishlist) {
                // Structure: {wishlist: [...]}
                items = response.wishlist;
            } else if (Array.isArray(response?.data)) {
                // Structure: {data: [...]}
                items = response.data;
            } else if (Array.isArray(response)) {
                // Structure: [...]
                items = response;
            }
            
            console.log('Wishlist items:', items); // Debug
            setWishlistItems(items);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            console.error('Error details:', error.response); // Debug
            // Don't show error toast on initial load
            setWishlistItems([]);
        } finally {
            setLoading(false);
        }
    };

    // Add item to wishlist (or toggle if exists)
    const addToWishlist = async (product) => {
        if (!user) {
            toast.error('Vui lòng đăng nhập để thêm vào yêu thích');
            return;
        }

        try {
            const response = await wishlistService.addToWishlist(product.id);
            
            // Check if it was added or removed (toggle behavior)
            if (response?.data?.action === 'removed') {
                // Remove from state
                setWishlistItems(prev => prev.filter(item => item.id !== product.id));
                toast.success('Đã xóa khỏi yêu thích');
            } else {
                // Refetch from backend to ensure correct data structure
                await fetchWishlist();
                toast.success('Đã thêm vào yêu thích');
            }
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            toast.error(error.response?.data?.message || 'Không thể thực hiện');
        }
    };

    // Remove item from wishlist
    const removeFromWishlist = async (productId) => {
        if (!user) {
            return;
        }

        try {
            await wishlistService.removeFromWishlist(productId);
            setWishlistItems(prev => prev.filter(item => item.id !== productId));
            toast.success('Đã xóa khỏi yêu thích');
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            toast.error('Không thể xóa khỏi yêu thích');
        }
    };

    // Toggle wishlist (add if not exists, remove if exists)
    // Now just calls addToWishlist which handles toggle on backend
    const toggleWishlist = async (product) => {
        await addToWishlist(product);
    };

    // Check if item is in wishlist
    const isInWishlist = (productId) => {
        return wishlistItems.some(item => item.id === productId);
    };

    // Clear wishlist
    const clearWishlist = async () => {
        if (!user) {
            return;
        }

        try {
            await wishlistService.clearWishlist();
            setWishlistItems([]);
            toast.success('Đã xóa toàn bộ yêu thích');
        } catch (error) {
            console.error('Error clearing wishlist:', error);
            toast.error('Không thể xóa danh sách yêu thích');
        }
    };

    // Get wishlist count
    const getWishlistCount = () => {
        return wishlistItems.length;
    };

    const value = {
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        getWishlistCount,
        loading,
        fetchWishlist
    };

    return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

