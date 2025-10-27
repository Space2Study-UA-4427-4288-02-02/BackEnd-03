const checkUserExistence = require('~/seed/checkUserExistence')
const seedOffer = require('~/seed/seedOffer')
const seedCategory = require('~/seed/seedCategory')
const seedSubject = require('~/seed/seedSubject')
const logger = require('~/logger/logger')

const checkDataExistence = async () => {
  try {
    // Спочатку створюємо користувача
    await checkUserExistence()

    await seedCategory.createCategory()
    await seedSubject.createSubject()
    await seedOffer.createOffer()
  } catch (err) {
    logger.error('Error in checkDataExistence:', err)
  }
}

module.exports = checkDataExistence
