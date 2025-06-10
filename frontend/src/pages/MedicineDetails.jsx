import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiShoppingCart } from "react-icons/fi";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.css';
import { AppContext } from '../context/AppContext';

const MedicineDetailPage = () => {
    const navigate = useNavigate();
    const { cart, setCart, backendUrl,token } = useContext(AppContext);
    const [medicine, setMedicine] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();



  const addToCart = async (id, name, imageUrl, price) => {
    try {
        const response = await axios.post(backendUrl + '/api/user/add', {
            id, 
            name, 
            imageUrl, 
            price
        }, {
            headers: {
                token
            }
        });

        if (response.data.success) {
            setCart(prevCart => [...prevCart, { id, name, imageUrl, price }]);
            toast.success(`${name} added to cart!`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    } catch (error) {
        console.error("Error adding to cart:", error);
        toast.error(error.response?.data?.message || "Failed to add to cart");
    }
};



    const handleCartClick = () => {
        navigate("/cart");
    };

    const fetchMedicineDetails = async () => {
        if (!id) {
            toast.error("No medicine ID provided");
            navigate('/shop');
            return;
        }

        try {
            const { data } = await axios.post(backendUrl + '/api/user/singleMedicine', {
                _id: id  
            });

            if (data.success) {
                setMedicine(data.data);
            } else {
                toast.error(data.message);
                navigate('/shop');
            }
        } catch (error) {
            console.error("Error fetching medicine:", error);
            toast.error(error.response?.data?.message || "Failed to load medicine details");
            navigate('/shop');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchMedicineDetails();
        } else {
            toast.error("Invalid medicine ID");
            navigate('/shop');
        }
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!medicine) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500">Medicine not found</p>
            </div>
        );
    }

    return (
        <div className='relative'>
            <ToastContainer />
            {/* Cart Button at Top (matches Shop page) */}
            <div className="sticky top-0 z-10 bg-white shadow-sm">
                <div className="container mx-auto px-4 py-3 flex justify-end">
                    <button
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={handleCartClick}
                    >
                        <FiShoppingCart size={18} />
                        <span>Cart</span>
                        <span className="bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                            {cart.length}
                        </span>
                    </button>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="md:flex">
                        <div className="md:w-1/2 p-6">
                            <img
                                className="w-full h-64 object-contain"
                                src={medicine.imageUrl}
                                alt={medicine.name}
                            />
                        </div>
                        <div className="md:w-1/2 p-6">
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">{medicine.name}</h1>
                            <p className="text-gray-600 mb-4">{medicine.manufacturer}</p>
                            <p className="text-blue-600 text-xl font-bold mb-4">${medicine.price.toFixed(2)}</p>

                            <div className="mb-4">
                                <h2 className="text-lg font-semibold mb-2">Description</h2>
                                <p className="text-gray-700">{medicine.description}</p>
                            </div>

                            <div className="mb-4">
                                <h2 className="text-lg font-semibold mb-2">Dosage</h2>
                                <p className="text-gray-700">{medicine.dosage}</p>
                            </div>

                            <div className="flex justify-between items-center mt-6">
                                <button
                                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                                    onClick={() => navigate('/shop')}
                                >
                                    Back to Shop
                                </button>
                                <button
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    onClick={() => addToCart(
                                        medicine._id, 
                                        medicine.name, 
                                        medicine.imageUrl, 
                                        medicine.price
                                    )}
                                >
                                    <FiShoppingCart size={16} />
                                    <span>Add to Cart</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MedicineDetailPage;