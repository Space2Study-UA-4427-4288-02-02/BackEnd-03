const Offer = require('~/models/offer')
const User = require('~/models/user')
const logger = require('~/logger/logger')
const {
  roles: { TUTOR }
} = require('~/consts/auth')

const seedOffer = {
  createOffer: async () => {
    try {
      // Перевіряємо, чи вже існує offer
      const existingOffer = await Offer.findOne({ title: 'Test English Offer' })
      if (existingOffer) {
        logger.info('Test offer already exists')
        return existingOffer
      }

      // Знаходимо користувача з роллю tutor
      const tutor = await User.findOne({ role: TUTOR })
      if (!tutor) {
        logger.error('No tutor found in database')
        return null
      }

      // Створюємо offer
      const offerData = {
        title: 'Test English Offer',
        price: 500,
        proficiencyLevel: 'Beginner',
        description: 'This is a test offer for English language learning',
        languages: ['English', 'Ukrainian'],
        authorRole: 'tutor',
        author: tutor._id,
        subject: '63da8767c9ad4c9a0b0eacd3', // Замініть на реальний ID subject з вашої БД
        category: '63da8767c9ad4c9a0b0eacd3', // Замініть на реальний ID category з вашої БД
        status: 'active',
        FAQ: [
          {
            question: 'How long is one lesson?',
            answer: 'Each lesson is 60 minutes long'
          },
          {
            question: 'Do you provide materials?',
            answer: 'Yes, all materials are provided'
          }
        ]
      }

      const offer = await Offer.create(offerData)
      logger.info('Test offer created successfully')
      return offer
    } catch (err) {
      logger.error('Error creating test offer:', err)
    }
  }
}

module.exports = seedOffer
