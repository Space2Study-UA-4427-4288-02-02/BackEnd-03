const Subject = require('~/models/subject')
const Category = require('~/models/category')
const logger = require('~/logger/logger')

const seedSubject = {
  createSubject: async () => {
    try {
      // Перевіряємо, чи вже існує subject
      const existingSubject = await Subject.findOne({ name: 'English' })
      if (existingSubject) {
        logger.info('Test subject already exists')
        return existingSubject
      }

      // Знаходимо категорію Languages
      const category = await Category.findOne({ name: 'Languages' })
      if (!category) {
        logger.error('Category "Languages" not found. Please create category first.')
        return null
      }

      // Створюємо subject
      const subjectData = {
        name: 'English',
        category: category._id
      }

      const subject = await Subject.create(subjectData)
      logger.info('Test subject created successfully:', subject.name)
      return subject
    } catch (err) {
      logger.error('Error creating test subject:', err)
      return null
    }
  }
}

module.exports = seedSubject
