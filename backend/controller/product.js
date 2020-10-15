const Product = require('../models/product.js')
const User = require('../models/user.js')
const jwt = require('jsonwebtoken')

const addProduct = (req, res) => {
    const product = new Product(req.body)
    product.save()
        .then(() => res.json("product added!"))
        .catch(err => res.status(400).json("ERROR: " + err))
}

const getProducts = (req, res) => {
    Product.find()
        .then(product => res.json(product))
        .catch(err => res.status(404).json("ERROR: " + err))
}

const getProduct = (req, res) => {
    Product.findById(req.params.id)
        .then(product => res.json(product))
        .catch(err => res.status(400).json("ERROR: ", + err))
}

const deleteProduct = (req, res) => {
    Product.findByIdAndDelete(req.params.id)
        .then(product => res.json(product._id + " deleted!"))
        .catch(err => res.status(400).json("ERROR: " + err))
}

const updateProduct = (req, res) => {
    Product.findByIdAndUpdate(req.params.id)
        .then(product => {
            product.title = req.body.title,
                product.description = req.body.description,
                product.price = req.body.price,
                product.images = req.body.images
            product.category = req.body.category
            product.save()
                .then(product => res.json(product._id + " updated!"))
                .catch(err => res.status(400).json("ERROR " + err))
        })
        .catch(err => res.status(404).json("ERROR: " + err))
}

const addToCart = (req, res) => {
    const token = req.headers.w_auth
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    User.findOne({ _id: decoded._id }, (err, userInfo) => {
        let duplicate = false;

        userInfo.cart.forEach((item) => {
            if (item.id == req.params.id) {
                duplicate = true;
            }
        })

        if (duplicate) {
            User.findOneAndUpdate(
                { _id: decoded._id, "cart.id": req.params.id },
                { $inc: { "cart.$.quantity": 1 } },
                { new: true },
                (err, userInfo) => {
                    if (err) return res.json({ success: false, err });
                    res.status(200).json(userInfo.cart)
                }
            )
        } else {
            User.findOneAndUpdate(
                { _id: decoded._id },
                {
                    $push: {
                        cart: {
                            id: req.params.id,
                            quantity: 1,
                            date: Date.now()
                        }
                    }
                },
                { new: true },
                (err, userInfo) => {
                    if (err) return res.json({ success: false, err });
                    res.status(200).json(userInfo.cart)
                }
            )
        }
    })
}

const removeFromAllCarts = (req, res) => {
    User.find()
        .then(user => {
            for (let i = 0; i < user.length; i++) {
                if (user[i].cart.length !== 0) {
                    for (let j = 0; j < user[i].cart.length; j++) {
                        if (user[i].cart[j].id === req.query.id) {
                            user[i].cart.splice(j, 1)
                            user[i].save()
                                .then(user => res.json(user))
                                .catch(err => res.status(400).json(err))
                        }
                    }
                } else {
                    return res.status(200).json("User cart is empty")
                }
            }
        })
        .catch(err => res.status(404).json("ERROR: " + err))
}

const removeFromCart = (req, res) => {
    const token = req.headers.w_auth
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    User.findOneAndUpdate({ _id: decoded._id }, { "$pull": { "cart": { "id": req.query.id } } }, { new: true }, (err, user) => {
        let cart = user.cart
        let array = cart.map(item => {
            return item.id
        })
        Product.find({ "_id": { $in: array } })
            .populate("writer")
            .exec((err, cartDetail) => {
                return res.status(200).json({
                    cartDetail,
                    cart
                })
            })
    })
}

const cartProducts = (req, res) => {
    let productIds = []
    let ids = req.query.id.split(',')
    productIds = ids.map(item => {
        return item
    })
    Product.find({ '_id': { $in: productIds } })
        .populate('writer')
        .exec((err, product) => {
            if (!product) return res.status(404)
            else if (err) return res.status(400).send(err)
            return res.status(200).send(product)
        })
}

module.exports = { addProduct, getProducts, getProduct, deleteProduct, addToCart, cartProducts, removeFromAllCarts, removeFromCart, updateProduct }