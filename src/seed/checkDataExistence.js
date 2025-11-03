const checkUserExistence = require('~/seed/checkUserExistence')
// const seedOffer = require('~/seed/seedOffer')
const seedSubject = require('~/seed/seedSubject')
const logger = require('~/logger/logger')

const checkDataExistence = async () => {
  try {
    await checkUserExistence()
    await seedSubject.createSubject()
    // offers are already generated therefore seeding offers again is not necessary
    // await seedOffer.createOffer()
  } catch (err) {
    logger.error('Error in checkDataExistence:', err)
  }
}

module.exports = checkDataExistence
