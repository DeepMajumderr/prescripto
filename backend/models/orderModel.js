import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: {
    type: [
      {
        id: { type: String, required: true }, 
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
      }
    ],
    required: true
  },
  address: {type: Object, required: true},
  amount: { type: Number, required: true },
  date: { type: Number, required: true } 
});

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema);
export default orderModel;
