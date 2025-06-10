import { v2 as cloudinary } from 'cloudinary';
import MedicineModel from '../models/medicineModel.js';

// Add new medicine
const addMedicine = async (req, res) => {
    try {
        const { name, description, price, category, manufacturer, dosage } = req.body;
        const imageFile = req.file; // Single image upload


        // Validate required fields
        if (!name || !description || !price || !category || !manufacturer || !dosage) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }

        // Upload image to Cloudinary if exists
        // let imageUrl = '';
        // if (imageFile) {
        //     const result = await cloudinary.uploader.upload(imageFile.path, {
        //         resource_type: 'image',
        //         folder: 'medicines'
        //     });
        //     imageUrl = result.secure_url;
        // }

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
        const imageUrl = imageUpload.secure_url

        const medicineData = {
            name,
            description,
            category,
            manufacturer,
            price: Number(price),
            dosage,
            imageUrl,
            createdAt: new Date()
        };

        const medicine = new MedicineModel(medicineData);
        await medicine.save();

        res.status(201).json({
            success: true,
            message: "Medicine added successfully",
        });

    } catch (error) {
        console.error("Error adding medicine:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// List all medicines
const listMedicines = async (req, res) => {
    try {
        const medicines = await MedicineModel.find({})
            .sort({ createdAt: -1 })
            .select('-__v'); // Exclude version key

        res.json({
            success: true,
            data: medicines,
            count: medicines.length
        });

    } catch (error) {
        console.error("Error listing medicines:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch medicines",
            error: error.message
        });
    }
};

// Remove medicine
const removeMedicine = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Medicine ID is required"
            });
        }

        const deletedMedicine = await MedicineModel.findByIdAndDelete(id);

        if (!deletedMedicine) {
            return res.status(404).json({
                success: false,
                message: "Medicine not found"
            });
        }

        // Optional: Delete image from Cloudinary
        if (deletedMedicine.imageUrl) {
            const publicId = deletedMedicine.imageUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`medicines/${publicId}`);
        }

        res.json({
            success: true,
            message: "Medicine deleted successfully",
            data: { id: deletedMedicine._id }
        });

    } catch (error) {
        console.error("Error removing medicine:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete medicine",
            error: error.message
        });
    }
};

// Get single medicine details
const getMedicine = async (req, res) => {
    try {
        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({
                success: false,
                message: "Medicine ID is required"
            });
        }

        const medicine = await MedicineModel.findById(_id)
            .select('-__v'); // Exclude version key

        if (!medicine) {
            return res.status(404).json({
                success: false,
                message: "Medicine not found"
            });
        }

        res.json({
            success: true,
            data: medicine
        });

    } catch (error) {
        console.error("Error fetching medicine:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch medicine details",
            error: error.message
        });
    }
};

export {
    addMedicine,
    listMedicines,
    removeMedicine,
    getMedicine
};