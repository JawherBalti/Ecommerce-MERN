const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const productRoute = require('./routes/product')
const userRoute = require('./routes/user')
const categoryRoute = require('./routes/category')
const accountRoute = require('./routes/account')
const cookieParser = require("cookie-parser");

dotenv.config()
const db_uri = process.env.db_uri
const port = process.env.port

const app = express()

app.use(express.json())
app.use(cors())
app.use(cookieParser());


app.use('/uploads', express.static('uploads'))
app.use('/', accountRoute)
app.use("/products", productRoute)
app.use("/users", userRoute)
app.use("/categories", categoryRoute)

mongoose.connect(db_uri, {  useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false }) //usefindandmodify to remove mongoose warning
mongoose.connection.once("open", () => {
    console.log("Connection to database established")
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})