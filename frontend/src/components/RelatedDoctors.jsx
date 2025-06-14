import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const RelatedDoctors = ({ docId, speciality }) => {

    const { doctors } = useContext(AppContext)
    const navigate = useNavigate()

    const [relDoc, setRelDoc] = useState([])

    useEffect(() => {
        if (doctors.length > 0 && speciality) {
            const doctorsData = doctors.filter((doc) => doc.speciality === speciality && doc._id !== docId)
            setRelDoc(doctorsData)
        }
    }, [doctors, speciality, docId])

    // return (
    //     <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
    //         <h1 className='text-3xl font-medium'>Top Doctors to Book</h1>
    //         <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted doctors.</p>
    //         <div className='w-full grid grid-cols-5 gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
    //             {relDoc.slice(0, 5).map((item, index) => (
    //                 <div onClick={() => {navigate(`/appointment/${item._id}`); scrollTo(0,0)}} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
    //                     <img className='bg-blue-50' src={item.image} alt="" />
    //                     <div className='p-4'>
    //                         <div className='flex items-center gap-2 text-sm text-center text-green-500'>
    //                             <p className='w-2 h-2 bg-green-500 rounded-full'></p><p>Available</p>
    //                         </div>
    //                         <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
    //                         <p className='text-gray-600 text-sm'>{item.speciality}</p>
    //                     </div>
    //                 </div>
    //             ))}
    //         </div>
    //         <button onClick={() => { navigate('/doctors'); scrollTo(0, 0) }} className='bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10'>more</button>
    //     </div>
    // )

    return (
        <div className='flex flex-col items-center gap-4 my-16 text-gray-900 px-4 md:mx-10'>
            <h1 className='text-2xl sm:text-3xl font-medium text-center'>Top Doctors to Book</h1>
            <p className='w-full sm:w-2/3 text-center text-sm text-gray-600'>Simply browse through our extensive list of trusted doctors.</p>

            {/* Responsive Grid Layout */}
            <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
                {relDoc.slice(0, 5).map((item, index) => (
                    <div
                        onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }}
                        className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'
                        key={index}
                    >
                        <img className='w-full h-auto bg-blue-50' src={item.image} alt={item.name} />
                        <div className='p-4 text-center'>
                            <div className={`flex items-center ${item.available ? 'text-green-500' : 'text-gray-500'} justify-center gap-2 text-sm`}>
                                <p className={`w-2 h-2 ${item.available ? 'bg-green-500' : 'bg-gray-500'} rounded-full`}></p><p>{item.available ? 'Available' : 'Not Available'}</p>
                            </div>
                            <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                            <p className='text-gray-600 text-sm'>{item.speciality}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* View More Button */}
            <button
                onClick={() => { navigate('/doctors'); scrollTo(0, 0) }}
                className='bg-blue-50 text-gray-600 px-6 sm:px-12 py-2 sm:py-3 rounded-full mt-10 transition hover:bg-blue-100'
            >
                More
            </button>
        </div>
    )
}

export default RelatedDoctors