import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

const Orders = () => {
  const { token, backendUrl } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/user/listOrders`, {
          headers: {
            token
          }
        });
       
        setOrders([...response.data.orders].reverse());
      } catch (err) {
        setError('No orders yet.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [token, backendUrl]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
        <p>{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-md mx-auto mt-12 text-center">
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-800">No orders yet</h3>
          <p className="mt-2 text-gray-500">Your order history will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Order History</h1>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            {/* Order header */}
            <div className="px-6 py-4 bg-gray-50 border-b flex flex-col sm:flex-row justify-between">
              <div className="mb-2 sm:mb-0">
                <p className="text-sm text-gray-500">Order #{order._id.slice(-6).toUpperCase()}</p>
                <p className="text-sm font-medium text-gray-700">
                  Placed on {new Date(order.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">
                  Total: <span className="text-indigo-600">${order.amount.toFixed(2)}</span>
                </span>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                  Completed
                </span>
              </div>
            </div>

            {/* Order items */}
            <div className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <div key={item.id} className="p-6 flex items-center">
                  <div className="ml-4 flex-1">
                    <h3 className="text-base font-medium text-gray-800">{item.name}</h3>
                    <div className="mt-2 flex justify-between items-center">
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium text-gray-900">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Shipping info */}
            <div className="px-6 py-4 bg-gray-50 border-t">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Shipping Address</h4>
              <div className="text-sm text-gray-600">
                <p>{order.address.street}</p>
                <p>{order.address.city}, {order.address.state} {order.address.zip}</p>
                <p>{order.address.country}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;