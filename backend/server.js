import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './config/mongodb.js'
import connectCloudinary  from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'
import medicineRouter from './routes/medicineRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'



// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

// api endpoints
app.use('/api/admin',adminRouter)
app.use('/api/admin',medicineRouter)
// localhost:4000/api/admin

app.use('/api/doctor',doctorRouter)

app.use('/api/user',userRouter)
app.use('/api/user',medicineRouter)
app.use('/api/user',cartRouter)
app.use('/api/user', orderRouter)

app.get('/', (req,res)=>{
    res.send('API WORKING ')
})

app.listen(port, ()=> console.log('Server Started', port))