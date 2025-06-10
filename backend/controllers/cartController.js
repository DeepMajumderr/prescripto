import userModel from "../models/userModel.js";


const addToCart = async (req, res) => {
    try {
        const { id, name, imageUrl, price, userId } = req.body;

        // Validate input
        if (!id || !name || !imageUrl || price === undefined) {
            return res.status(400).json({
                success: false,
                message: "All fields (id, name, imageUrl, price, userId) are required"
            });
        }

        // Find user
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }



        // Check if item already exists in cart
        const existingItemIndex = user.cartData.findIndex(
            item => item.id.toString() === id.toString()
        );



        if (existingItemIndex !== -1) {
            // Item exists, increase quantity
            user.cartData[existingItemIndex].quantity += 1;
            user.markModified('cartData');
            await user.save();

            return res.status(200).json({
                success: true,
                message: "Item quantity updated in cart",
                cartData: user.cartData
            });
        }

        // Add new item to cart
        const newItem = {
            id: id.toString(), // ensure id is stored as string for consistency
            name,
            imageUrl,
            price,
            quantity: 1,
            addedAt: new Date()
        };

        user.cartData.push(newItem);
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Item added to cart successfully",
            cartData: user.cartData
        });

    } catch (error) {
        console.error("Error adding to cart:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};



const increaseQuantity = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const itemIndex = user.cartData.findIndex(item => item.id === productId);
        if (itemIndex === -1) return res.status(404).json({ success: false, message: 'Item not in cart' });

        user.cartData[itemIndex].quantity += 1;
        user.markModified('cartData');
        await user.save();

        res.status(200).json({ success: true, message: 'Quantity increased', cartData: user.cartData });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
    }
};


const decreaseQuantity = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const itemIndex = user.cartData.findIndex(item => item.id === productId);
        if (itemIndex === -1) return res.status(404).json({ success: false, message: 'Item not in cart' });

        if (user.cartData[itemIndex].quantity > 1) {
            user.cartData[itemIndex].quantity -= 1;
            user.markModified('cartData');
            await user.save();
            res.status(200).json({ success: true, message: 'Quantity decreased', cartData: user.cartData });
        } else {
            res.status(400).json({ success: false, message: 'Quantity cannot be less than 1' });
        }

    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
    }
};


const removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        user.cartData = user.cartData.filter(item => item.id !== productId);
        user.markModified('cartData');
        await user.save();

        res.status(200).json({ success: true, message: 'Item removed from cart', cartData: user.cartData });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
    }
};


const getCart = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Cart fetched successfully",
            cartData: user.cartData
        });

    } catch (err) {
        console.error("Error fetching cart:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        });
    }
};


const clearCart = async (req, res) => {
    try {
        const { userId } = req.body;

        // Find the user
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Clear the cart
        user.cartData = [];
        user.markModified('cartData');
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Cart cleared successfully',
            cartData: user.cartData
        });

    } catch (error) {
        console.error("Error clearing cart:", error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};






export { addToCart, increaseQuantity, decreaseQuantity, removeFromCart, getCart, clearCart }