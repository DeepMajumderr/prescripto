import mongoose from 'mongoose'

const MedicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  dosage: { type: String, required: true },
  imageUrl: { type: String }
}, { timestamps: true });

const MedicineModel = mongoose.models.Medicine || mongoose.model('Medicine', MedicineSchema);

export default MedicineModel;