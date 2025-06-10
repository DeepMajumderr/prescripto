import Order from "../models/orderModel.js";



// Create an order
 const createOrder = async (req, res) => {
    try {
        const { userId, items, amount,address } = req.body; 

        // Validate the request
        if (!userId || !items || !amount) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Create a new order document
        const newOrder = new Order({
            userId,
            items,
            address,
            amount,
            date: Date.now(),
        });

        // Save the order to the database
        const savedOrder = await newOrder.save();

        // await userModel.findByIdAndUpdate(userId,{cartData:{}})
        res.json({success:true, message:"Order Placed"})
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get all orders for a user
 const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.body; // Assuming userId is passed as a parameter
        
        const orders = await Order.find({ userId });  // Find orders by userId
        
        if (!orders.length) {
            return res.status(404).json({ success: false, message: "No orders found" });
        }
        
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export {createOrder,getUserOrders}