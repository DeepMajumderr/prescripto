import express from 'express'
import { addToCart, increaseQuantity,decreaseQuantity,removeFromCart, getCart, clearCart} from '../controllers/cartController.js'
import authUser from '../middlewares/authUser.js'

const cartRouter = express.Router()

cartRouter.post('/add',authUser,addToCart)
cartRouter.post('/increase',authUser,increaseQuantity)
cartRouter.post('/decrease',authUser, decreaseQuantity)
cartRouter.post('/remove',authUser,removeFromCart)
cartRouter.post('/get-cart', authUser, getCart);
cartRouter.post('/clear-cart', authUser, clearCart);


export default cartRouter