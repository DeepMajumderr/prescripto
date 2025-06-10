import React, { useState } from 'react';
import { GiMedicinePills } from "react-icons/gi";

const ListMedicine = () => {
  // Using your hardcoded medicine data
  const [medicines, setMedicines] = useState([
    {
      _id: 'med1',
      name: 'Crocin Advance',
      image: <GiMedicinePills className="text-2xl text-gray-600" />,
      category: 'Pain Relief',
      manufacturer: 'GSK Consumer Healthcare',
      price: 2.50,
      dosage: '1-2 tablets every 4-6 hours',
    },
    {
      _id: 'med2',
      name: 'Liver Detox Formula',
      image: <GiMedicinePills className="text-2xl text-gray-600" />,
      category: 'Liver Care',
      manufacturer: 'Himalaya Wellness',
      price: 15.99,
      dosage: '1 capsule twice daily',
    },
    {
      _id: 'med3',
      name: 'Centrum Multivitamin',
      image: <GiMedicinePills className="text-2xl text-gray-600" />,
      category: 'Multivitamin',
      manufacturer: 'Pfizer',
      price: 12.75,
      dosage: '1 tablet daily',
    },
    {
      _id: 'med4',
      name: 'Marula Oil Serum',
      image: <GiMedicinePills className="text-2xl text-gray-600" />,
      category: 'Skincare',
      manufacturer: 'The Ordinary',
      price: 22.50,
      dosage: 'Apply 2-3 drops',
    },
    {
      _id: 'med5',
      name: 'Hyaluronic Acid',
      image: <GiMedicinePills className="text-2xl text-gray-600" />,
      category: 'Skincare',
      manufacturer: 'The Ordinary',
      description: 'Intense hydration serum that helps retain skin moisture and improve skin texture.',
      price: 18.00,
      dosage: 'Apply a few drops to damp skin daily',
    },
    {
      _id: 'med6',
      name: 'Volini Spray',
      image: <GiMedicinePills className="text-2xl text-gray-600" />,
      category: 'Pain Relief',
      manufacturer: 'Sanofi',
      description: 'Fast-acting pain relief spray for muscle and joint pain. Provides cooling sensation and quick relief.',
      price: 8.25,
      dosage: 'Spray on affected area 3-4 times daily',
    }
  ]);

  const removeMedicine = (id) => {
    if (window.confirm('Are you sure you want to remove this medicine?')) {
      setMedicines(medicines.filter(medicine => medicine._id !== id));
      alert('Medicine removed successfully! (Frontend demo)');
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-4">Medicine Inventory</h1>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">All Medicines List</h2>
        </div>

        <div className="p-4">
          {/* List table title */}
          <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-3 px-4 bg-gray-50 text-sm font-medium text-gray-600 rounded-t-lg'>
            <span>Image</span>
            <span>Name</span>
            <span>Category</span>
            <span>Manufacturer</span>
            <span>Price</span>
            <span className='text-center'>Action</span>
          </div>

          {/* Medicine List */}
          {medicines.map((medicine) => (
            <div
              className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center gap-4 py-3 px-4 border-b text-sm hover:bg-gray-50'
              key={medicine._id}
            >
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                {medicine.image}
              </div>
              <p className="font-medium text-gray-800">{medicine.name}</p>
              <p className="text-gray-600">{medicine.category}</p>
              <p className="hidden md:block text-gray-600">{medicine.manufacturer}</p>
              <p className="text-gray-800">${medicine.price.toFixed(2)}</p>
              <div className="flex justify-end md:justify-center">
                <button
                  onClick={() => removeMedicine(medicine._id)}
                  className='cursor-pointer text-lg text-red-500 hover:text-red-700 focus:outline-none'
                  aria-label="Remove medicine"
                >
                  ×
                </button>
              </div>
            </div>
          ))}

          {medicines.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              No medicines found in inventory
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListMedicine;