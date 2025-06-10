import express from 'express'
import authAdmin from '../middlewares/authAdmin.js'
import upload from '../middlewares/multer.js'
import {addMedicine,listMedicines, removeMedicine, getMedicine } from '../controllers/medicineController.js'


const medicineRouter = express.Router()

// Add medicine with single image
medicineRouter.post('/addMedicine', authAdmin, upload.single('image'), addMedicine);

// List all medicines
medicineRouter.get('/listMedicines', listMedicines);

// Remove medicine
medicineRouter.post('/removeMedicne', authAdmin, removeMedicine);

// Get single medicine details
medicineRouter.post('/singleMedicine', getMedicine);

export default medicineRouter;
