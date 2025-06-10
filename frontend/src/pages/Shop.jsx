import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

const Shop = () => {
    const navigate = useNavigate();
    const { backendUrl } = useContext(AppContext); 
    const [medicines, setMedicines] = useState([]);

    const getMedicinesData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/listMedicines');
            if (data.success) {
                setMedicines(data.data);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } 
    };

    useEffect(() => {
        getMedicinesData();
    }, []);

    return (
        <div className='relative'>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Our Pharmacy</h1>

                <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                    {medicines.map((item, index) => (
                        <div
                            className='border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300'
                            key={index}
                        >
                            <img
                                className='w-full h-48 object-contain bg-gray-50 p-4'
                                src={item.imageUrl}
                                alt={item.name}
                                onClick={() => navigate(`/shop/${item._id}`)}
                            />
                            <div className='p-4'>
                                <p className='text-gray-900 text-lg font-medium truncate'>{item.name}</p>
                                <p className='text-gray-600 text-sm mb-2'>{item.category}</p>
                                <p className='text-gray-700 text-sm line-clamp-2 mb-3'>{item.description}</p>

                                <div className='flex justify-between items-center'>
                                    <p className='text-blue-600 font-bold'>${item.price.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Shop;