import React, { useState, useContext } from 'react';
import { GiMedicinePills } from "react-icons/gi";
import { assets } from '../../assets/assets';
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const AddMedicine = () => {
  const [medicineImg, setMedicineImg] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [dosage, setDosage] = useState('');

  const { backendUrl, aToken } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (!medicineImg) {
        return toast.error('Medicine image not selected');
      }

      const formData = new FormData();
      formData.append('image', medicineImg);
      formData.append('name', name);
      formData.append('category', category);
      formData.append('manufacturer', manufacturer);
      formData.append('description', description);
      formData.append('price', Number(price));
      formData.append('dosage', dosage);

      // Log form data for debugging
      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });

      const { data } = await axios.post(
        `${backendUrl}/api/admin/addMedicine`,
        formData,
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message);
        // Reset form
        setMedicineImg(false);
        setName('');
        setCategory('');
        setManufacturer('');
        setDescription('');
        setPrice('');
        setDosage('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      console.error(error);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='m-5 w-full'>
      <p className='mb-3 text-lg font-medium'>Add Medicine</p>

      <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
        <div className='flex items-center gap-4 mb-8 text-gray-500'>
          <label htmlFor="medicine-img" className='cursor-pointer'>
            <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden'>
              {medicineImg ? (
                <img 
                  src={URL.createObjectURL(medicineImg)} 
                  alt="Medicine preview" 
                  className='w-full h-full object-cover'
                />
              ) : (
                <GiMedicinePills className='text-3xl text-gray-400' />
              )}
            </div>
          </label>

          <input 
            onChange={(e) => setMedicineImg(e.target.files[0])} 
            type="file" 
            id="medicine-img" 
            hidden 
          />

          <p>Upload medicine <br /> picture</p>
        </div>

        <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
          <div className='w-full lg:flex-1 flex flex-col gap-4'>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Medicine name</p>
              <input 
                onChange={(e) => setName(e.target.value)} 
                value={name} 
                className='border-rounded px-3 py-2 border rounded' 
                type="text" 
                placeholder='e.g. Crocin Advance' 
                required 
              />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Category</p>
              <input 
                onChange={(e) => setCategory(e.target.value)} 
                value={category} 
                className='border-rounded px-3 py-2 border rounded' 
                type="text" 
                placeholder='e.g. Pain Relief' 
                required 
              />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Manufacturer</p>
              <input 
                onChange={(e) => setManufacturer(e.target.value)} 
                value={manufacturer} 
                className='border-rounded px-3 py-2 border rounded' 
                type="text" 
                placeholder='e.g. GSK Consumer Healthcare' 
                required 
              />
            </div>
          </div>

          <div className='w-full lg:flex-1 flex flex-col gap-4'>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Price ($)</p>
              <input 
                onChange={(e) => setPrice(e.target.value)} 
                value={price} 
                className='border-rounded px-3 py-2 border rounded' 
                type="number" 
                placeholder='e.g. 2.50' 
                step="0.01"
                min="0"
                required 
              />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Dosage Instructions</p>
              <input 
                onChange={(e) => setDosage(e.target.value)} 
                value={dosage} 
                className='border-rounded px-3 py-2 border rounded' 
                type="text" 
                placeholder='e.g. 1-2 tablets every 4-6 hours' 
                required 
              />
            </div>
          </div>
        </div>

        <div>
          <p className='mt-4 mb-2'>Description</p>
          <textarea 
            onChange={(e) => setDescription(e.target.value)} 
            value={description} 
            className='w-full px-4 pt-2 border rounded' 
            placeholder='Describe the medicine...' 
            rows={5} 
            required 
          />
        </div>

        <button 
          type='submit' 
          className='bg-primary px-10 py-3 mt-4 text-white rounded-full'
        >
          Add Medicine
        </button>
      </div>
    </form>
  );
};

export default AddMedicine;