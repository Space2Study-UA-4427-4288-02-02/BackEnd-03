const Category = require('~/models/category')
const logger = require('~/logger/logger')

const seedCategory = {
  createCategory: async () => {
    try {
      // Перевіряємо, чи вже існує категорія
      const existingCategory = await Category.findOne({ name: 'Languages' })
      if (existingCategory) {
        logger.info('Test category already exists')
        return existingCategory
      }

      // Створюємо категорію
      const categoryData = {
        name: 'Languages',
        appearance: {
          icon: 'language',
          color: '#4CAF50'
        }
      }

      const category = await Category.create(categoryData)
      logger.info('Test category created successfully:', category.name)
      return category
    } catch (err) {
      logger.error('Error creating test category:', err)
      return null
    }
  }
}

module.exports = seedCategory
