const router = require('express').Router()
const controller = require('../controller/user.js')
const User = require('../models/user.js')
const multer = require('multer')
const expressJwt = require('express-jwt')
const _ = require('lodash')
// const { OAth2Client, IAMAuth, auth } = require('google-auth-library')
const fetch = require('node-fetch')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const { errorHandler } = require('../helpers/dbErrorHandling.js')
const nodemailer = require('nodemailer')
const dotenv = require('dotenv')

dotenv.config()
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
            return cb(res.status(400).end('only jpg, png allowed', false))
        }
        cb(null, true)
    }
})
var upload = multer({ storage: storage }).single("file")

router.get("/", controller.getUsers)
router.route("/:id").get(controller.getUser)
router.post("/uploadImage", (req, res) => {
    upload(req, res, err => {
        if (err) return res.json({ success: false, err })
        return res.json({ success: true, image: res.req.file.path, fileName: res.req.file.filename })
    })
})

router.post("/update/:id", controller.updateUser)
router.route("/delete/:id").delete(controller.deleteUser)

module.exports = router