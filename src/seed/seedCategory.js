const Category = require('~/models/category')
const logger = require('~/logger/logger')

const seedCategory = {
  createCategory: async () => {
    try {
      const categoriesData = [
        {
          name: 'Languages',
          appearance: { icon: 'language', color: '#4CAF50' }
        },
        {
          name: 'Mathematics',
          appearance: { icon: 'calculate', color: '#2196F3' }
        },
        {
          name: 'Physics',
          appearance: { icon: 'science', color: '#009688' }
        },
        {
          name: 'Programming',
          appearance: { icon: 'code', color: '#FF5722' }
        }
      ]

      const results = []

      for (const cat of categoriesData) {
        const existing = await Category.findOne({ name: cat.name })
        if (existing) {
          logger.info(`Category already exists: ${cat.name}`)
          results.push(existing)
          continue
        }

        const created = await Category.create(cat)
        logger.info(`Category created: ${created.name}`)
        results.push(created)
      }

      return results
    } catch (err) {
      logger.error('Error creating categories:', err)
      return []
    }
  }
}

module.exports = seedCategory
