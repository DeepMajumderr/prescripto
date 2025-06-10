import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Cart = () => {
    const {
        cart,
        setCart,
        totalPrice,
        setTotalPrice,
        backendUrl,
        token,
        userId
    } = useContext(AppContext);

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    // Fetch cart from backend on page load
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await axios.post(
                    `${backendUrl}/api/user/get-cart`,
                    {},
                    { headers: { token } }
                );

                if (res.data?.cartData) {
                    setCart(res.data.cartData);
                    calculateTotal(res.data.cartData);
                } else {
                    toast.error('Failed to load cart data');
                }
            } catch (error) {
                console.error('Error fetching cart:', error);
                toast.error('Error fetching cart');
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [backendUrl, token, setCart]);

    const calculateTotal = (cartItems) => {
        const total = cartItems.reduce(
            (sum, item) => sum + (item.price * item.quantity),
            0
        );
        setTotalPrice(total);
    };

    const handleQuantityChange = async (productId, action) => {
        setUpdatingId(productId);
        try {
            let endpoint;
            switch (action) {
                case 'increase':
                    endpoint = '/increase';
                    break;
                case 'decrease':
                    endpoint = '/decrease';
                    break;
                case 'remove':
                    endpoint = '/remove';
                    break;
                default:
                    return;
            }

            const res = await axios.post(
                `${backendUrl}/api/user${endpoint}`,
                { productId },
                { headers: { token } }
            );

            if (res.data.success) {
                setCart(res.data.cartData);
                calculateTotal(res.data.cartData);
                if (action === 'remove') {
                    toast.success('Item removed from cart!');
                }
            }
        } catch (error) {
            console.error(`Error ${action} quantity:`, error);
            toast.error(`Failed to ${action} quantity`);
        } finally {
            setUpdatingId(null);
        }
    };

    const handleCheckout = () => {
        navigate('/place-order');
    };

    return (
        <div className="relative min-h-screen bg-gray-50">
            <ToastContainer />
            <div className="sticky top-0 z-10 bg-white shadow-sm">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <button
                        onClick={() => navigate('/shop')}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        &larr; Back to Shop
                    </button>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-700">
                            Total Items: {cart.reduce((sum, item) => sum + item.quantity, 0)}
                        </span>
                        <button
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            onClick={() => navigate('/shop')}
                        >
                            <FiShoppingCart size={18} />
                            <span>Shop More</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Medicine Cart</h1>

                {loading ? (
                    <div className="text-center py-20 text-gray-600">Loading your cart...</div>
                ) : cart.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <FiShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
                        <h2 className="text-2xl font-medium text-gray-700 mb-2">Your cart is empty</h2>
                        <p className="text-gray-500 mb-6">Looks like you haven't added any medicines yet</p>
                        <button
                            onClick={() => navigate('/shop')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                            Browse Medicines
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                {[...cart].reverse().map((item) => (
                                    <div key={item.id} className="p-4 border-b last:border-b-0 flex flex-col sm:flex-row">
                                        <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                className="w-20 h-20 object-contain rounded"
                                            />
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                                            <p className="text-gray-600">${item.price.toFixed(2)} each</p>
                                            <div className="flex items-center mt-3">
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, 'decrease')}
                                                    disabled={item.quantity <= 1 || updatingId === item.id}
                                                    className="p-1 bg-gray-200 rounded-l disabled:opacity-50 hover:bg-gray-300"
                                                >
                                                    <FiMinus size={14} />
                                                </button>
                                                <span className="px-3 py-1 bg-gray-100">
                                                    {updatingId === item.id ? '...' : item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, 'increase')}
                                                    disabled={updatingId === item.id}
                                                    className="p-1 bg-gray-200 rounded-r hover:bg-gray-300"
                                                >
                                                    <FiPlus size={14} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end justify-between sm:ml-4">
                                            <p className="font-semibold text-lg">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                            <button
                                                onClick={() => handleQuantityChange(item.id, 'remove')}
                                                disabled={updatingId === item.id}
                                                className="flex items-center text-red-500 hover:text-red-700 mt-2 sm:mt-0"
                                            >
                                                <FiTrash2 size={16} className="mr-1" />
                                                <span className="text-sm">Remove</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                                <h2 className="text-xl font-bold mb-4 text-gray-800">Order Summary</h2>
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                                        <span className="font-medium">${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                    <div className="border-t pt-4 flex justify-between font-bold text-lg text-gray-800">
                                        <span>Total</span>
                                        <span>${totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    disabled={cart.length === 0 || updatingId !== null}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition duration-200 flex items-center justify-center disabled:opacity-50"
                                >
                                    {updatingId ? 'Processing...' : 'Proceed to Checkout'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;