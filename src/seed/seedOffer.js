const Offer = require('~/models/offer')
const User = require('~/models/user')
const Subject = require('~/models/subject')
const Category = require('~/models/category')
const logger = require('~/logger/logger')
const {
  roles: { TUTOR }
} = require('~/consts/auth')

const seedOffer = {
  createOffer: async () => {
    try {
      const tutor = await User.findOne({ role: TUTOR })
      if (!tutor) {
        logger.error('No tutor found in database')
        return []
      }

      const targetCategoryNames = [
        'Language',
        'Mathematics',
        'History',
        'Computer science',
        'Music',
        'Design',
        'Biology',
        'Painting',
        'Finances',
        'Audit',
        'Chemistry',
        'Astronomy'
      ]

      const categories = await Category.find({ name: { $in: targetCategoryNames } })
      const createdOffers = []

      for (const category of categories) {
        const subjects = await Subject.find({ categoryId: category._id })
        if (!subjects || subjects.length === 0) {
          logger.warn(`No subjects found for category: ${category.name}`)
          continue
        }

        const chosenSubjects = subjects.slice(0, Math.min(2, subjects.length))

        for (const subj of chosenSubjects) {
          const offersCount = Math.random() < 0.5 ? 1 : 2
          for (let i = 0; i < offersCount; i++) {
            const level = i === 0 ? 'Beginner' : 'Intermediate'
            const title = `${subj.name} ${level} Course${offersCount > 1 ? ` (${i + 1})` : ''}`
            const existing = await Offer.findOne({ title })
            if (existing) {
              logger.info(`Offer already exists: ${title}`)
              createdOffers.push(existing)
              continue
            }

            const offerData = {
              title,
              price: 400 + Math.floor(Math.random() * 700),
              proficiencyLevel: level,
              description: `Course on ${subj.name} (${category.name}) for ${level.toLowerCase()}`,
              languages:
                category.name.toLowerCase().includes('lang') || category.name.includes('Мови')
                  ? ['English', 'Ukrainian']
                  : ['Ukrainian'],
              authorRole: 'tutor',
              author: tutor._id,
              category: category._id,
              subject: subj._id,
              status: 'active',
              FAQ: [{ question: 'How long is one lesson?', answer: '60 minutes' }]
            }

            const offer = await Offer.create(offerData)
            logger.info(`Offer created: ${offer.title} (subject: ${subj.name}, category: ${category.name})`)
            createdOffers.push(offer)
          }
        }
      }

      if (createdOffers.length === 0) {
        logger.warn('No offers were created (no matching categories/subjects found)')
      }

      return createdOffers
    } catch (err) {
      logger.error('Error creating offers:', err)
      return []
    }
  }
}

module.exports = seedOffer
