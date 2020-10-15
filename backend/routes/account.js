const router = require('express').Router()
const controller = require('../controller/user.js')

const { validSign, validLogin, resetPasswordValidator, forgotPasswordValidator} = require('../helpers/valid')
router.post("/signUp", validSign, controller.registerUser)
router.post("/activate", controller.activateAccount)
router.post("/login", validLogin, controller.login)
//logout happening on client side because the token is stored in the browser
router.put("/password/forgot", forgotPasswordValidator, controller.forgotPassword)
router.put("/password/reset", resetPasswordValidator, controller.resetPassword)
module.exports = router