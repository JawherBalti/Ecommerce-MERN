const Category = require('../models/category.js')

const getCategories = (req, res) => {
    Category.find()
        .then(category => res.json(category))
        .catch(err => res.status(404).json("ERROR: " + err))
}

const getCategory = (req, res) => {
    Category.findById(req.params.id)
        .then(category => res.json(category))
        .catch(err => res.status(404).json("ERROR: " + err))
}

const addCategory = (req, res) => {
    const category = new Category(req.body)
    category.save()
    .then(() => res.json("category added!"))
    .catch(err => res.status(400).json("ERROR: " + err))
}

const deleteCategory = (req, res) => {
    Category.findByIdAndDelete(req.params.id)
        .then(category => res.json(category._id + " deleted!"))
        .catch(err => res.status(404).json("ERROR: " + err))
}

const updateCategory = (req, res) => {
    Category.findByIdAndUpdate(req.params.id)
        .then(category => {
            category.name = req.body.name,
            category.images = req.body.images
            category.save()
            .then(category => res.json(category._id + " updated!"))
            .catch(err => res.status(400).json("ERROR: " + err))
        })
        .catch(err => res.status(404).json("ERROR: " + err))
}

module.exports = { addCategory, getCategories, getCategory, deleteCategory, updateCategory }