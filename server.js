require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const connection = require('./connection')
const userRouter = require('./routes/user')
const categoryRouter = require('./routes/category')
const productRouter = require('./routes/product')
const billRouter = require('./routes/bill')
const dashboardRouter = require('./routes/dashboard')
const port = process.env.PORT || 3000
app.use(cors())
app.use(express.json())
app.use('/user', userRouter)
app.use('/category', categoryRouter)
app.use('/product', productRouter)
app.use('/bill', billRouter)
app.use('/dashboard', dashboardRouter)
app.get('/',(req,res) => {
    res.send('cafe management system')
})
app.listen(port, () => {
    console.log('server is on port 3000')
})

