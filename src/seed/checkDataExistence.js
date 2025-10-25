const checkUserExistence = require('~/seed/checkUserExistence')
const seedOffer = require('~/seed/seedOffer')
const logger = require('~/logger/logger')

const checkDataExistence = async () => {
  try {
    // Спочатку створюємо користувача
    await checkUserExistence()

    await seedOffer.createOffer()
  } catch (err) {
    logger.error('Error in checkDataExistence:', err)
  }
}

module.exports = checkDataExistence
