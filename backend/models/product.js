const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    images: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Product", productSchema)