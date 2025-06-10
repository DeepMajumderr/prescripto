import express from 'express'
import { createOrder,getUserOrders } from "../controllers/orderController.js";
import authUser from '../middlewares/authUser.js';

const orderRouter = express.Router()

orderRouter.get('/listOrders', authUser, getUserOrders)
orderRouter.post('/create', authUser, createOrder)

export default orderRouter
