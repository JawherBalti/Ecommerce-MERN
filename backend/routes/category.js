const router = require('express').Router()
const controller = require('../controller/category')

router.route("/").get(controller.getCategories)
router.route("/:id").get(controller.getCategory)
router.post("/add", controller.addCategory)
router.route("/delete/:id").delete(controller.deleteCategory)
router.post("/update/:id", controller.updateCategory)

module.exports = router