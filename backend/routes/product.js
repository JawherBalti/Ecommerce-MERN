const router = require('express').Router()
const { requireSignin } = require('../controller/user.js')
const controller = require('../controller/product')
const Product = require('../models/product.js')
const multer = require('multer')
const auth = require('../helpers/isAuth')
const fs = require('fs')


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.exrname(file.originalname)
        if (ext !== '.jpg' || ext !== '.png') {
            return cb(res.status(400).send('only jpg, png allowed', false))
        }
        cb(null, true)
    }
})

var upload = multer({ storage: storage }).single("file")

router.get('/cartProducts', controller.cartProducts)

router.get('/addToCart/:id', auth, controller.addToCart);

router.get("/removeFromCart", auth, controller.removeFromCart)

router.get("/removeFromAllCarts", controller.removeFromAllCarts)

router.get("/", auth, controller.getProducts)

router.get("/home", controller.getProducts)
router.get("/:id", controller.getProduct)

router.post("/uploadImage", (req, res) => {
    upload(req, res, err => {
        if (err) return res.json({ success: false, err })
        return res.json({ success: true, image: res.req.file.path, fileName: res.req.file.filename })
    })
})

router.delete("/deleteImage", (req, res) => {
    Product.findById(req.query.id)
        .then(product => {
            fs.unlink(product.images, function () { res.json('Deleted!') })
        })
        .catch(err => res.status(400).json(err))
})

router.post("/add", controller.addProduct)

router.delete("/delete/:id", controller.deleteProduct)
router.post("/update/:id", controller.updateProduct)

module.exports = router