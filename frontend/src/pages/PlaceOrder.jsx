import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiChevronDown } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const PlaceOrder = () => {
    const {
        cart,
        setCart,
        totalPrice,
        setTotalPrice,
        backendUrl,
        token
    } = useContext(AppContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        apartment: '',
        city: '',
        state: '',
        zipcode: '',
        country: 'India',
        phone: '',
        deliveryNotes: ''
    });
    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);

    // Countries list for dropdown
    const countries = [
        'India',
        'United States',
        'Canada',
        'United Kingdom',
        'Australia',
        'Germany',
        'France',
        // Add more countries as needed
    ];

    // Fetch cart from backend on component mount
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
                toast.error('Error loading your cart');
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [backendUrl, token, setCart, setTotalPrice]);

    const calculateTotal = (cartItems) => {
        const total = cartItems.reduce(
            (sum, item) => sum + (item.price * item.quantity),
            0
        );
        setTotalPrice(total);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setPlacingOrder(true);

        // Validation
        const requiredFields = ['firstName', 'lastName', 'email', 'street', 'city', 'zipcode', 'country', 'phone'];
        const missingFields = requiredFields.filter(field => !formData[field]);

        

        if (missingFields.length > 0) {
            toast.error('Please fill all required fields');
            setPlacingOrder(false);
            return;
        }

        try {
            // Send order to backend
            const orderData = {
                address: formData,       
                items: cart,
                amount: totalPrice,      
            };

            console.log("Sending order:", orderData);

            const res = await axios.post(
                `${backendUrl}/api/user/create`,
                orderData,
                { headers: { token } }
            );

            if (res.data.success) {
                // Clear cart after successful order
                await axios.post(
                    `${backendUrl}/api/user/clear-cart`,
                    {},
                    { headers: { token } }
                );

                toast.success(
                    <div className="flex items-center gap-2">
                        <FiCheckCircle className="text-green-500" size={20} />
                        <span>Order placed successfully!</span>
                    </div>,
                    {
                        position: "top-right",
                        autoClose: 3000,
                    }
                );

                // Redirect to orders page
                setTimeout(() => {
                    setCart([]);
                    navigate('/my-orders');
                }, 3000);
            }
        } catch (error) {
            console.error('Error placing order:', error);
            toast.error(error.response?.data?.message || 'Failed to place order');
        } finally {
            setPlacingOrder(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="spinner border-4 border-blue-500 border-t-transparent rounded-full w-12 h-12 animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your cart...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <ToastContainer />
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Complete Your Order</h1>

                {cart.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <h2 className="text-2xl font-medium text-gray-700 mb-2">Your cart is empty</h2>
                        <p className="text-gray-500 mb-6">You don't have any items to checkout</p>
                        <button
                            onClick={() => navigate('/shop')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Delivery Information */}
                        <div className="lg:w-2/3">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">
                                    Delivery Information
                                </h2>

                                <form onSubmit={handlePlaceOrder}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Contact Information</h3>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                First Name *
                                            </label>
                                            <input
                                                required
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                type="text"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Last Name *
                                            </label>
                                            <input
                                                required
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                type="text"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Email *
                                            </label>
                                            <input
                                                required
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                type="email"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Phone Number *
                                            </label>
                                            <input
                                                required
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                type="tel"
                                                placeholder="+1 (555) 123-4567"
                                            />
                                        </div>

                                        <div className="md:col-span-2 mt-6">
                                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Shipping Address</h3>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Street Address *
                                            </label>
                                            <input
                                                required
                                                name="street"
                                                value={formData.street}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                type="text"
                                                placeholder="123 Main St"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Apartment, Suite, etc. (Optional)
                                            </label>
                                            <input
                                                name="apartment"
                                                value={formData.apartment}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                type="text"
                                                placeholder="Apt 4B"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                City *
                                            </label>
                                            <input
                                                required
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                type="text"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                State/Province
                                            </label>
                                            <input
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                type="text"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                ZIP/Postal Code *
                                            </label>
                                            <input
                                                required
                                                name="zipcode"
                                                value={formData.zipcode}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                type="text"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Country *
                                            </label>
                                            <div className="relative">
                                                <select
                                                    name="country"
                                                    value={formData.country}
                                                    onChange={handleInputChange}
                                                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                                                    required
                                                >
                                                    {countries.map(country => (
                                                        <option key={country} value={country}>{country}</option>
                                                    ))}
                                                </select>
                                                <FiChevronDown className="absolute right-3 top-3 text-gray-400" />
                                            </div>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Delivery Notes (Optional)
                                            </label>
                                            <textarea
                                                name="deliveryNotes"
                                                value={formData.deliveryNotes}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                rows="3"
                                                placeholder="Special instructions, delivery preferences, etc."
                                            ></textarea>
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <button
                                            type="submit"
                                            disabled={placingOrder}
                                            className={`bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition duration-200 ${placingOrder ? 'opacity-70 cursor-not-allowed' : ''} mx-auto block`}
                                        >
                                            {placingOrder ? 'Placing Order...' : 'Place Order'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:w-1/3">
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

                                <div className="border-t pt-4">
                                    <h3 className="font-medium text-gray-700 mb-2">Payment Method</h3>
                                    <div className="bg-gray-100 p-3 rounded-md">
                                        <p className="text-gray-800">Cash on Delivery (COD)</p>
                                        <p className="text-sm text-gray-500 mt-1">Pay with cash when your order is delivered</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlaceOrder;