const categoryService = require('~/services/category')

const createCategory = async (req, res) => {
  const { name, appearance } = req.body

  const category = await categoryService.createCategory(name, appearance)

  res.status(201).json(category)
}

const getCategories = async (_, res) => {
  const categories = await categoryService.getCategories()

  res.status(200).json(categories)
}

const getCategoriesNames = async (_, res) => {
  const categoriesNames = await categoryService.getCategoriesNames()

  res.status(200).json(categoriesNames)
}

module.exports = {
  createCategory,
  getCategories,
  getCategoriesNames
}
