const Category = require('~/models/category')
const { createError } = require('~/utils/errorsHelper')
const { CATEGORY_NAME_NOT_UNIQUE } = require('~/consts/errors')

const categoryService = {
  createCategory: async (name, appearance) => {
    const duplicateCategory = await Category.findOne({ name }).lean().exec()

    if (duplicateCategory) {
      throw createError(400, CATEGORY_NAME_NOT_UNIQUE)
    }

    return await Category.create({
      name,
      appearance
    })
  },

  getCategories: async () => {
    return await Category.find().lean().exec()
  },

  getCategoriesNames: async () => {
    return await Category.find().select('name').exec()
  }
}

module.exports = categoryService
